'use strict'

class Get404Precondition {
  constructor (inject) {
    this.inject = inject
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)
    return true
  }
}

module.exports = Get404Precondition
