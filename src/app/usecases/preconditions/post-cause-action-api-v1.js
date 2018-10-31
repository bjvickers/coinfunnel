'use strict'

class PostCauseActionAPIV1Precondition {
  constructor (inject) {
    this.inject = inject
  }

  async execute (req, res, usecase) {
    res.locals.clientId = decodeURIComponent(req.body.clientId)
    res.locals.externalCauseId = decodeURIComponent(req.body.externalCauseId)
    res.locals.causeAction = decodeURIComponent(req.body.action)

    this.inject.logService.debug({
      clientId: res.locals.clientId,
      externalCauseId: res.locals.externalCauseId,
      action: res.locals.causeAction },
      'Starting PostCauseActionAPIV1Precondition...')

    res.locals.cause = await this.inject.dbService.getCauseDataMapper().findByExternalId(res.locals.externalCauseId)
    if (!res.locals.cause) {
      usecase.emit('handleNotFound')
      return false
    }

    this.inject.logService.debug({
      clientId: res.locals.clientId,
      externalCauseId: res.locals.externalCauseId,
      action: res.locals.causeAction },
      'Found Cause in PostCauseActionAPIV1Precondition...')

    return true
  }
}

module.exports = PostCauseActionAPIV1Precondition
