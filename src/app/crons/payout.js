'use strict'

const config = require('config')
const cron = require('node-cron')
const request = require('request')

let inject = null

const getAllUserWallets = async (currentCause) => {
  let wallets = []
  wallets.push(await inject.dbService.getWalletDataMapper().findCurrentByUserId(currentCause.userId))

  const previousWallets = await inject.dbService.getWalletDataMapper().findPreviousByUserId(currentCause.userId)
  if (previousWallets.length) {
    wallets = wallets.concat(previousWallets)
  }

  // Remove system wallets, because they belong to CoinFunnel.
  wallets = wallets.filter(current => current.creatorType !== inject.WalletCreatorTypes.System)

  return wallets
}

const updateWalletBalances = async (wallets) => {
  let newBalance = null
  for (let i = 0; i < wallets.length; i++) {
    inject.logService.debug({ wallet: wallets[i].address }, 'Cron: Updating wallet balance...')

    try {
      newBalance = await getBalance(wallets[i].address)
      wallets[i].balance = newBalance
      await inject.dbService.getWalletDataMapper().persist(wallets[i])
    } catch (err) {
      inject.logService.error({ err: err }, 'Cron: Wallet balance details not available in pool...')
    }
  }
}

const updateWalletPaymentHistories = async (currentCause, wallets) => {
  let payments = null
  for (let i = 0; i < wallets.length; i++) {
    inject.logService.debug({ wallet: wallets[i].address }, 'Cron: Updating payment history for wallet...')

    try {
      payments = await getPayments(wallets[i].address)
      await inject.dbService.getCausePayoutDataMapper().persist(currentCause.id, wallets[i].id, payments)
    } catch (err) {
      inject.logService.error({ err: err }, 'Cron: Wallet payment history not available for wallet...')
    }
  }
}

const getBalance = (address) => {
  return new Promise((resolve, reject) => {
    const url = `${config.get('pool.api.balanceUrl')}${address}}`
    inject.logService.debug({ poolUrl: url }, 'Cron: Url for balance retrieval...')

    request(url, { timeout: config.get('pool.api.timeout') }, (err, res, body) => {
      if (err) {
        return reject(err)
      }

      const payload = JSON.parse(body)
      inject.logService.debug({ payload: payload }, 'Cron: Wallet balance payload received...')

      if (payload.error) {
        return reject(payload.error)
      }
      return resolve(payload.data)
    })
  })
}

const getPayments = (address) => {
  return new Promise((resolve, reject) => {
    const url = `${config.get('pool.api.paymentsUrl')}${address}}`
    inject.logService.debug({ poolUrl: url }, 'Cron: Url for payments retrieval...')

    request(url, { timeout: config.get('pool.api.timeout') }, (err, res, body) => {
      if (err) {
        return reject(err)
      }

      const payload = JSON.parse(body)
      inject.logService.debug({ payload: payload }, 'Cron: Wallet payments payload received...')

      if (payload.error) {
        return reject(payload.error)
      }
      return resolve(payload.data)
    })
  })
}

// @todo
// */ Use aggregation to caculate sum payouts per Cause
// */ If a Cause is deleted when it is currently set as the 'currentCause', then this
//    will reset back to the first Cause.
cron.schedule('*/10 * * * * *', async () => {
  try {
    inject.logService.debug({}, 'Cron: Running payout cron...')
    let nextCause = null

    let currentCause = await inject.dbService.getPayoutCronDataMapper().getCurrentCause()
    if (!currentCause) {
      inject.logService.debug({}, 'Cron: No current Cause for cron to process. Resetting with first...')
      nextCause = await inject.dbService.getCauseDataMapper().getFirst()
      await inject.dbService.getPayoutCronDataMapper().setCurrentCause(nextCause)
      return
    }

    inject.logService.debug({ causeId: currentCause.id }, 'Cron: Processing current Cause in cron..')

    // Get all wallets for this cause.
    let wallets = await getAllUserWallets(currentCause)
    if (!wallets.length) {
      inject.logService.debug({ causeId: currentCause.id }, 'Cron: No user wallets to process. Setting next cause and finishing...')
      nextCause = await inject.dbService.getCauseDataMapper().getNext(currentCause)
      await inject.dbService.getPayoutCronDataMapper().setCurrentCause(nextCause)
      return
    }

    // Update wallet balances and the payment history for each wallet
    // const previousTotalPayout = currentCause.totalPayouts
    await updateWalletBalances(wallets)
    await updateWalletPaymentHistories(currentCause, wallets)

    // Update total payouts for the current Cause in the database
    currentCause.totalPayouts = await inject.dbService.getCausePayoutDataMapper().getTotalForCause(currentCause)
    inject.logService.debug({ causeId: currentCause.id, totalPayouts: currentCause.totalPayouts }, 'Cron: Total payouts for Cause')
    await inject.dbService.getCauseDataMapper().persist(currentCause)

    // Update the total payouts across all Causes
    if (currentCause.totalPayouts) {
      inject.logService.debug({}, 'Cron: Updating sum of all payouts')
      const sumAllPayouts = await inject.dbService.getCauseDataMapper().calcSumAllPayouts()
      await inject.dbService.getTotalsDataMapper().persistSumAllPayouts(sumAllPayouts)
    }

    inject.logService.debug({ causeId: currentCause.id }, 'Cron: Successful cron run. Setting next cause then finishing...')
    nextCause = await inject.dbService.getCauseDataMapper().getNext(currentCause)
    await inject.dbService.getPayoutCronDataMapper().setCurrentCause(nextCause)
  } catch (err) {
    inject.logService.debug({ err: err }, 'Cron: An error occurred in the cron run. Exiting and will retry later...')
  }
})

module.exports = (injector) => {
  inject = injector
}
