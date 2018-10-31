'use strict'

class GetFAQPrecondition {
  constructor (inject) {
    this.inject = inject
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)
    return true
  }
}

module.exports = GetFAQPrecondition
