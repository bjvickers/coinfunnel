'use strict'

const _ = require('lodash')

let inject = null
let WalletSchema = null
let WalletFromDbWalletMapping = null

const findByWalletId = async (walletId) => {
  const walletSchema = await _findOne({ id: walletId })
  if (!walletSchema) {
    return null
  }
  return inject.WalletFactory.createWalletFromSchema(walletSchema, WalletFromDbWalletMapping)
}

const findCurrentByUserId = async (userId) => {
  const walletSchema = await _findOne({ user_id: userId, date_removed: null })
  if (!walletSchema) {
    return null
  }
  return inject.WalletFactory.createWalletFromSchema(walletSchema, WalletFromDbWalletMapping)
}

const findPreviousByUserId = async (id) => {
  let walletSchemas = await _findAll({ user_id: id })
  if (!walletSchemas) {
    return []
  }

  // Remove the current wallet (identified by having a null value for date_removed),
  // convert the WalletSchemas to Wallet models, then order by Wallet.dateRemoved.
  walletSchemas = walletSchemas.filter(currentSchema => currentSchema.date_removed !== null)
  const wallets = walletSchemas.map(currentSchema => inject.WalletFactory.createWalletFromSchema(currentSchema, WalletFromDbWalletMapping))
  return _.orderBy(wallets, 'dateRemoved', 'desc')
}

const _findOne = (searchSchema) => {
  return new Promise((resolve, reject) => {
    WalletSchema.findOne(searchSchema, (err, walletSchema) => {
      if (err) {
        inject.logService.error({ err: err, searchSchema: searchSchema }, 'Error locating existing Wallet document in database')
        return reject(err)
      }
      return resolve(walletSchema)
    })
  })
}

const _findAll = (searchSchema) => {
  return new Promise((resolve, reject) => {
    WalletSchema.find(searchSchema, (err, walletSchemas) => {
      if (err) {
        inject.logService.error({ err: err, searchSchema: searchSchema }, 'Error locating existing Wallet documents in database')
        return reject(err)
      }
      return resolve(walletSchemas)
    })
  })
}

const persist = async (wallet) => {
  try {
    const walletSchema = (wallet.id) ? await _findOne({ id: wallet.id }) : new WalletSchema()
    return await _persist(wallet, walletSchema)
  } catch (err) {
    throw err
  }
}

const _persist = (wallet, walletSchema) => {
  return new Promise(async (resolve, reject) => {
    walletSchema.id = walletSchema._id.toString()
    walletSchema.user_id = wallet.userId
    walletSchema.wallet_currency = wallet.currency.getCurrency()
    walletSchema.wallet_address = wallet.address
    walletSchema.wallet_creator_type = wallet.creatorType
    walletSchema.date_added = wallet.dateAdded
    walletSchema.date_removed = wallet.dateRemoved
    walletSchema.balance = wallet.balance
    walletSchema.mining_donations = wallet.miningDonations
    walletSchema.save((err) => {
      if (err) {
        inject.logService.error({ err: err, wallet: wallet.toJSON() }, 'Error saving the WalletSchema to the database')
        return reject(err)
      }
      return resolve(inject.WalletFactory.createWalletFromSchema(walletSchema, WalletFromDbWalletMapping))
    })
  })
}

const remove = (wallet) => {
  return new Promise((resolve, reject) => {
    WalletSchema.remove({ id: wallet.id }, (err) => {
      if (err) {
        inject.logService.error({ err: err, wallet: wallet.toJSON() }, 'Error whilst deleting wallet in database')
        return reject(err)
      }
      return resolve()
    })
  })
}

const removeAll = async () => {
  try {
    await inject.dbDataMapperDecorator.removeAll(WalletSchema)
    inject.logService.info({}, 'Wallet::RemoveAll decorator attached to DAL')
  } catch (err) {
    inject.logService.info({}, 'Wallet::RemoveAll decorator not attached to DAL')
  }
}

module.exports = (injector) => {
  inject = injector
  WalletSchema = inject.WalletSchema
  WalletFromDbWalletMapping = inject.WalletFromDbWalletMapping

  return {
    findByWalletId,
    findCurrentByUserId,
    findPreviousByUserId,
    persist,
    remove,
    removeAll
  }
}
