'use strict'

const sanitizer = require('sanitizer')

class GetShowcasePrecondition {
  constructor (inject) {
    this.inject = inject
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)

    const cleanedPath = sanitizer.escape(req.params.causeCombinedPath)
    this.inject.logService.debug({ pathIn: req.params.causeCombinedPath, pathOut: cleanedPath }, 'Cause showcase path cleaned')
    res.locals.cause = await this.inject.dbService.getCauseDataMapper().findByCombinedPath(cleanedPath)

    if (!res.locals.cause.isOnline) {
      usecase.emit('handleNotFound')
      return false
    }

    return true
  }
}

module.exports = GetShowcasePrecondition
