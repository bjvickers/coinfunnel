'use strict'

const validate = require('validate.js')

const GetAllAPIV1Constraints = {
  client_id: {
    format: {
      pattern: /[a-z0-9- ]+/,
      message: `Client ID contains invalid characters`
    },
    length: {
      maximum: 60,
      message: `Client ID is too long`
    }
  },
  external_cause_id: {
    format: {
      pattern: /[a-z0-9]+/,
      message: `Charity ID contains invalid characters`
    },
    length: {
      maximum: 100,
      message: `Charity ID is too long`
    }
  }
}

class GetAllAPIV1Precondition {
  constructor (inject) {
    this.inject = inject
  }

  async execute (req, res, usecase) {
    this.inject.logService.debug({
      client_id: req.params.clientId,
      external_cause_id: req.params.externalCauseId },
      'Here in GetAllAPIV1Precondition')

    const validationResult = validate({
      client_id: req.params.clientId,
      external_cause_id: req.params.externalCauseId
    }, GetAllAPIV1Constraints, { fullMessages: false })

    if (validationResult) {
      this.inject.logService.info({ validationResult: validationResult }, 'API failed validation')
      usecase.emit('handleFailedValidation')
      return false
    }
    this.inject.logService.debug({}, 'Validation success in GetAllAPIV1Precondition')

    res.locals.cause = await this.inject.dbService.getCauseDataMapper().findByExternalId(req.params.externalCauseId)
    if (!res.locals.cause) {
      usecase.emit('handleNotFound')
      return false
    }
    this.inject.logService.debug({}, 'Found Cause in GetAllAPIV1Precondition')

    if (!res.locals.cause.isOnline) {
      usecase.emit('handleIsOffline', res.locals.cause.offlineNotice)
      return false
    }

    this.inject.logService.debug({}, 'Cause is Online in GetAllAPIV1Precondition')
    return true
  }
}

module.exports = GetAllAPIV1Precondition
