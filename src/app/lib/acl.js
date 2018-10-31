'use strict'

let ACL = null
let UserRoles = null

const isResourceExistant = (resource) => {
  let isExistant = false
  for (let accessControl in ACL) {
    if (ACL[accessControl].resource === resource) {
      isExistant = true
      break
    }
  }
  return isExistant
}

const isUserAuthorised = (resource, permission, role) => {
  let isAuthorised = false
  for (let accessControl in ACL) {
    if ((ACL[accessControl].resource === resource) && (ACL[accessControl].permission === permission)) {
      // We have found the resource the user wants to access. Now check they are
      // allowed to access it.
      if (ACL[accessControl].roles.indexOf(role) >= 0) {
        isAuthorised = true
      }
      break
    }
  }
  return isAuthorised
}

const getDashboardResource = (role) => {
  let resource = null
  switch (role) {
    case UserRoles.cause: resource = ACL.GetCauseIndex.resource; break
    case UserRoles.donator: resource = ACL.GetDonatorIndex.resource; break
    case UserRoles.admin: resource = ACL.GetAdminIndex.resource; break
    default: throw new Error('Dashboard resource not found')
  }
  return resource
}

const getDashboardTabResource = (role, controllerName) => {
  let resource = getDashboardResource(role)
  switch (controllerName) {
    case 'PostCauseOnlineStatusController':
    case 'DeleteNoticeController':
      resource = `${resource}/general`
      break
    case 'PostCauseController':
    case 'PostCauseImageController':
    case 'PostCauseImagePrimaryController':
    case 'DeleteCauseImageController':
    case 'PostCauseVerifyController':
      resource = `${resource}/charity`
      break
    case 'PostWalletController':
      resource = `${resource}/wallet`
      break
    case 'PostChangePasswordController':
    case 'PostCurrencyController':
      resource = `${resource}/account`
      break
  }
  return resource
}

const isCaptchaProtected = (resouce) => {
  switch (resouce) {
    case ACL.GetLogin.resource:
    case ACL.GetRegister.resource:
    case ACL.GetResetPassword.resource:
      return true
    default:
      return false
  }
}

module.exports = (inject) => {
  ACL = inject.ACL
  UserRoles = inject.UserRoles

  return {
    isResourceExistant,
    isUserAuthorised,
    getDashboardResource,
    getDashboardTabResource,
    isCaptchaProtected
  }
}
