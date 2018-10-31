'use strict'

const EventEmitter = require('events').EventEmitter

class PostWalletUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'PostWalletUseCase'
    this.inject = inject
  }

  logSuccess (userId, userEmail) {
    this.inject.logService.info({
      usecaseName: this.name,
      userId: userId,
      userEmail: userEmail }, 'Success')
  }

  updateWallet (existingWallet) {
    if (!existingWallet) {
      return
    }
    existingWallet.dateRemoved = new Date()
    return existingWallet
  }

  async updateWalletInDb (existingWallet) {
    if (!existingWallet) {
      return
    }
    await this.inject.dbService.getWalletDataMapper().persist(existingWallet)
  }

  async getMatchingPrevWallet (user, newWalletAddress) {
    const previousWallets = await this.inject.dbService.getWalletDataMapper().findPreviousByUserId(user.id)
    if (previousWallets.length) {
      for (let i = 0; i < previousWallets.length; i++) {
        if (previousWallets[i].address === newWalletAddress) {
          return previousWallets[i]
        }
      }
    }
    return null
  }

  createNewWallet (schema, user) {
    const newWallet = this.inject.WalletFactory.createWalletFromSchema(schema, this.inject.PostWalletMapping)
    newWallet.userId = user.id
    newWallet.dateAdded = new Date()
    return newWallet
  }

  async saveWalletToDb (wallet) {
    await this.inject.dbService.getWalletDataMapper().persist(wallet)
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.postWalletPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      // Move the current wallet to the previous wallet list
      await this.updateWalletInDb(this.updateWallet(res.locals.currentWallet))

      // Check if the new wallet is the same as a previous wallet
      const matchingPrevWallet = await this.getMatchingPrevWallet(res.locals.user, req.body.wallet_address)
      if (matchingPrevWallet) {
        // The wallet has been used before. Move it from the previous wallet
        // list to the current wallet.
        matchingPrevWallet.dateRemoved = null
        await this.inject.dbService.getWalletDataMapper().persist(matchingPrevWallet)
      } else {
        // The wallet has not been used before. Create and save.
        await this.saveWalletToDb(this.createNewWallet(req.body, res.locals.user))
      }

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = PostWalletUseCase
