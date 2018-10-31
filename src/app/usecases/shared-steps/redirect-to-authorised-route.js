'use strict'

class RedirectToAuthorisedRouteStep {
  constructor (inject) {
    this.UserRoles = inject.UserRoles
    this.ACL = inject.ACL
    this.logService = inject.logService
  }

  execute (req, res) {
    let redirectResource = null
    switch (res.locals.user.role) {
      case this.UserRoles.admin: redirectResource = this.ACL.GetAdminIndex.resource; break
      case this.UserRoles.cause: redirectResource = this.ACL.GetCauseIndex.resource; break
      case this.UserRoles.donator: redirectResource = this.ACL.GetDonatorIndex.resource; break
      case this.UserRoles.guest: redirectResource = this.ACL.GetLogin.resource; break
      default:
        this.logService.error({ role: res.locals.user.role }, 'Unknown user in redirect')
        redirectResource = this.ACL.GetLogin.resource
    }
    return redirectResource
  }
}

module.exports = RedirectToAuthorisedRouteStep
