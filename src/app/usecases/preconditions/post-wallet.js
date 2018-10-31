'use strict'

const validate = require('validate.js')

class PostWalletPrecondition {
  constructor (inject) {
    this.inject = inject
  }

  async findCurrentWalletInDb (user) {
    return this.inject.dbService.getWalletDataMapper().findCurrentByUserId(user.id)
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)

    const isUserAuthorised = this.inject.aclLibrary.isUserAuthorised(req.baseUrl, req.method.toLowerCase(), res.locals.user.role)
    if (!isUserAuthorised) {
      usecase.emit('handleFailedAuth')
      return false
    }

    const validationResult = validate(req.body, this.inject.PostWalletConstraints, { fullMessages: false })
    if (validationResult) {
      usecase.emit('handleFailedValidation', validationResult)
      return false
    }

    res.locals.currentWallet = await this.findCurrentWalletInDb(res.locals.user)
    if (res.locals.currentWallet.address === req.body.wallet_address) {
      this.inject.logService.info({ userId: res.locals.user.id }, 'Wallet is the same as the current wallet. Ignoring')
      usecase.emit('handleNoChange', 'Wallet address is the same as the current wallet address')
      return false
    }

    return true
  }
}

module.exports = PostWalletPrecondition
