'use strict'

const EventEmitter = require('events').EventEmitter

/**
 * @pending @todo
 * This code has not yet been implemented.
 */
class DeleteWalletPreviousUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'DeleteWalletPreviousUseCase'
    this.inject = inject
  }

  logSuccess (userId, userEmail) {
    this.inject.logService.info({
      usecaseName: this.name,
      userId: userId,
      userEmail: userEmail }, 'Success')
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.deletePreviousWalletPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      const walletAddress = res.locals.wallet.address
      this.inject.logService.info({ walletAddress: walletAddress }, 'Deleting wallet in database')
      await this.inject.dbService.getWalletDataMapper().remove(res.locals.wallet)

      // @todo
      // This email does not yet exist.
      // Send wallet deletion email
      // await this.inject.emailService.sendDeleteWalletRequest(res.locals.user, walletAddress)
      // this.inject.logService.info({}, 'Sent delete wallet email')

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = DeleteWalletPreviousUseCase
