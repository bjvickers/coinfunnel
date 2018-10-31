'use strict'

const EventEmitter = require('events').EventEmitter

class PostCurrencyUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'PostCurrencyUseCase'
    this.inject = inject
  }

  logSuccess (userId, userEmail) {
    this.inject.logService.info({
      usecaseName: this.name,
      userId: userId,
      userEmail: userEmail }, 'Success')
  }

  async persistUser (req, res) {
    await this.inject.dbService.getUserDataMapper().persist(res.locals.user)
    await this.inject.updateJwtUserStep.execute(req, res)
  }

  async execute (req, res) {
    try {
      this.inject.logService.debug({}, `Starting ${this.name}...`)

      const preconditionSatisfied = await this.inject.postCurrencyPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      // Load the user details stored in the token from the database, so that we have
      // access to the encrypted password. This will be necessary to persist the updated
      // user details back to the database.
      res.locals.user = await this.inject.dbService.getUserDataMapper().find(res.locals.user)
      res.locals.user.currency = req.body.account_currency
      await this.persistUser(req, res)

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = PostCurrencyUseCase
