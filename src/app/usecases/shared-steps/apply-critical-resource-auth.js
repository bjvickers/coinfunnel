'use strict'

class ApplyCriticalResourceAuthStep {
  constructor (inject) {
    this.inject = inject
  }

  execute (req, res) {
    if (!this.inject.aclLibrary.isResourceExistant(res.locals.usecase)) {
      throw new Error('Unknown usecase resource presented for critcal authorisation check')
    }

    const isUserAuthorised = this.inject.aclLibrary.isUserAuthorised(res.locals.usecase, 'use', res.locals.user.role)
    if (!isUserAuthorised) {
      throw new Error('User is not authorised for critical resource. Do not proceed.')
    }
  }
}

module.exports = ApplyCriticalResourceAuthStep
