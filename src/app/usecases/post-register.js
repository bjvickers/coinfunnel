'use strict'

const config = require('config')
const EventEmitter = require('events').EventEmitter

class PostRegisterUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'PostRegisterUseCase'
    this.inject = inject
  }

  logSuccess (userId, userEmail) {
    this.inject.logService.info({
      usecaseName: this.name,
      userId: userId,
      userEmail: userEmail }, 'Success')
  }

  async attachUserDefaults (user) {
    user.currency = config.get('currency_conversion.default')
    user.registrationState = this.inject.UserRegistrationStates.pre_confirmed
    user.passwordState = this.inject.UserPasswordStates.confirmed
    user.password.encryptedPassword = await this.inject.passwordLibrary.getEncPasswordFromClearPassword(user.password.clearPassword)
    return user
  }

  async silenceExpiredNotices (user) {
    const expiredNotices = await this.inject.dbService.getNoticeDataMapper().findAllExpired()
    expiredNotices.forEach(notice => user.noticesDeleted.push(notice.id))
    return user
  }

  async saveUserToDb (user) {
    return this.inject.dbService.getUserDataMapper().persist(user)
  }

  createInitialWallet (userId) {
    const address = this.inject.walletLibrary.createInitialWalletAddress()
    return this.inject.walletLibrary.createInitialWallet(userId, new this.inject.Monero(), address)
  }

  async saveWalletToDb (wallet) {
    await this.inject.dbService.getWalletDataMapper().persist(wallet)
  }

  createCause (userId) {
    const cause = this.inject.CauseFactory.create()
    cause.userId = userId
    cause.setExternalId(config.get('app.public_dns_domain'))
    return cause
  }

  async saveCauseToDb (cause) {
    await this.inject.dbService.getCauseDataMapper().persist(cause)
  }

  async updateRegistrationTotals () {
    let totals = await this.inject.dbService.getTotalsDataMapper().getTotals()
    let sumAllCauseRegistrations = totals.sum_all_cause_registrations || 0
    sumAllCauseRegistrations++
    await this.inject.dbService.getTotalsDataMapper().persistSumAllCauseRegistrations(sumAllCauseRegistrations)
  }

  // @todo
  // Think about creating different register endpoints for different user types
  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.postRegisterPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      // Attach additional User defaults and save to the database
      res.locals.user = await this.attachUserDefaults(res.locals.user)
      res.locals.user = await this.silenceExpiredNotices(res.locals.user)
      res.locals.user = await this.saveUserToDb(res.locals.user)

      // Extra operations for Cause users
      if (res.locals.user.role === this.inject.UserRoles.cause) {
        await this.saveWalletToDb(this.createInitialWallet(res.locals.user.id))
        await this.saveCauseToDb(this.createCause(res.locals.user.id))
      }

      // Execute the registration confirmation email actions
      await this.inject.applyTokenRequestStep.execute(res.locals.user, this.inject.TokenTypes.registration)

      // Increment the total number of Causes that have completed registration
      // with this site. Note that this does not reflect the number of Causes
      // currently in the dbase, as users may delete their account.
      await this.updateRegistrationTotals()

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = PostRegisterUseCase
