'use strict'

const validate = require('validate.js')

class PostCausePrecondition {
  constructor (inject) {
    this.name = 'PostCausePrecondition'
    this.inject = inject
  }

  async hasPassedExtraChecks (req, res, usecase) {
    if (req.body[this.inject.PostCauseSchema.cause_name] !== 'undefined') {
      const name = req.body[this.inject.PostCauseSchema.cause_name]
      if (name) {
        const possDuplicate = await this.inject.dbService.getCauseDataMapper().findByName(name)
        if ((possDuplicate) && (possDuplicate.userId !== res.locals.user.id)) {
          this.inject.logService.info({ cause: possDuplicate.toJSON() }, 'Cause name has already been taken')
          usecase.emit('handleCauseNameDuplicate')
          return false
        }
      }
    }
    return true
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)

    const isUserAuthorised = this.inject.aclLibrary.isUserAuthorised(req.baseUrl, req.method.toLowerCase(), res.locals.user.role)
    if (!isUserAuthorised) {
      usecase.emit('handleFailedAuth')
      return false
    }
    this.inject.logService.debug({}, 'User is authorised')

    const result = validate(req.body, this.inject.PostCauseConstraints, { fullMessages: false })
    if (result) {
      this.inject.logService.info({ validationResult: result }, 'Cause details change failed validation')
      usecase.emit('handleFailedValidation', result)
      return false
    }
    this.inject.logService.debug({}, 'Initial validation passed')

    const hasPassedChecks = await this.hasPassedExtraChecks(req, res, usecase)
    if (!hasPassedChecks) {
      return false
    }
    this.inject.logService.debug({}, 'Has passed extra checks')

    return true
  }
}

module.exports = PostCausePrecondition
