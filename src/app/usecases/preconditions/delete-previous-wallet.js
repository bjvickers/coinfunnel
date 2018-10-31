'use strict'

const sanitizer = require('sanitizer')

class DeletePreviousWalletPrecondition {
  constructor (inject) {
    this.inject = inject
  }

  getCleanWalletId (walletId) {
    const cleanWalletId = sanitizer.escape(walletId)
    return cleanWalletId
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)

    const isUserAuthorised = this.inject.aclLibrary.isUserAuthorised(req.baseUrl, req.method.toLowerCase(), res.locals.user.role)
    if (!isUserAuthorised) {
      usecase.emit('handleFailedAuth')
      return false
    }

    const cleanWalletId = this.getCleanWalletId(req.params.walletId)
    res.locals.wallet = await this.inject.dbService.getWalletDataMapper().findByWalletId(cleanWalletId)
    if (!res.locals.wallet) {
      this.inject.logService.debug({ walletId: cleanWalletId, userId: res.locals.user.id }, 'Wallet does not exist, cannot delete')
      usecase.emit('handleWalletNotFound')
      return false
    }

    if (res.locals.wallet.userId !== res.locals.user.id) {
      this.inject.logService.debug({ walletId: cleanWalletId, userId: res.locals.user.id }, 'Wallet does not belong to User, cannot delete')
      usecase.emit('handleWalletNotAssociatedWithUser')
      return false
    }

    return true
  }
}

module.exports = DeletePreviousWalletPrecondition
