'use strict'

class PostCurrencyPrecondition {
  constructor (inject) {
    this.name = 'PostCurrencyPrecondition'
    this.inject = inject
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)

    const isUserAuthorised = this.inject.aclLibrary.isUserAuthorised(req.baseUrl, req.method.toLowerCase(), res.locals.user.role)
    if (!isUserAuthorised) {
      usecase.emit('handleFailedAuth')
      return false
    }
    this.inject.logService.debug({}, 'User is authorised to change their currency display')

    const validCurrencies = ['eur', 'usd', 'gbp']
    if (validCurrencies.indexOf(req.body.account_currency) === -1) {
      this.inject.logService.info({}, 'Currency change failed validation')
      usecase.emit('handleFailedValidation', 'Unsupported currency requested')
      return false
    }

    return true
  }
}

module.exports = PostCurrencyPrecondition
