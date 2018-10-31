'use strict'

const config = require('config')

let logService = null
let ACL = null

const getBrandTitle = () => config.get('app.brand')

const getPageTitle = (resource) => {
  let pageTitle = getBrandTitle()
  switch (resource) {
    case ACL.GetShowcase.resource: pageTitle += ' | Mining'; break
    case ACL.GetIndex.resource: pageTitle += ' | Home'; break
    case ACL.GetExplore.resource: pageTitle += ' | Explore'; break
    case ACL.GetFAQ.resource: pageTitle += ' | FAQs'; break
    case ACL.GetLogin.resource: pageTitle += ' | Sign In'; break
    case ACL.GetRegister.resource: pageTitle += ' | Sign Up'; break
    case ACL.GetRegisterConfirm.resource: pageTitle += ' | Registration Confirmed'; break
    case ACL.GetResetPassword.resource: pageTitle += ' | Reset Password'; break
    case ACL.GetResetPasswordConfirm.resource: pageTitle += ' | Confirm Reset Password'; break
    case ACL.GetCauseIndex.resource: pageTitle += ' | Dashboard'; break
    case ACL.GetCausePayments.resource: pageTitle += ' | Payments'; break
    case ACL.GetDonatorIndex.resource: pageTitle += ' | Dashboard'; break
    case ACL.GetAdminIndex.resource: pageTitle += ' | Dashboard'; break
    case ACL.Get404.resource: pageTitle += ' | Page Unavailable'; break
    case ACL.Get500.resource: pageTitle += ' | System Failure'; break
    default:
      logService.error({ resource: resource }, 'Page title build error - resource unknown')
  }
  return pageTitle
}

const getRouteTitle = (resource) => {
  let routeTitle = null
  switch (resource) {
    case ACL.GetShowcase.resource: routeTitle = 'Mining Cryptocurrency for Charity'; break
    case ACL.GetIndex.resource: routeTitle = 'CoinFunnel'; break
    case ACL.GetExplore.resource: routeTitle = 'Find charities:'; break
    case ACL.GetFAQ.resource: routeTitle = 'FAQs'; break
    case ACL.GetLogin.resource: routeTitle = 'Sign in to ' + getBrandTitle(); break
    case ACL.GetRegister.resource: routeTitle = 'Sign up to ' + getBrandTitle(); break
    case ACL.GetRegisterConfirm.resource: routeTitle = 'Registration complete'; break
    case ACL.GetResetPassword.resource: routeTitle = 'Reset your password'; break
    case ACL.GetResetPasswordConfirm.resource: routeTitle = 'Enter your new password'; break
    case ACL.GetCauseIndex.resource: routeTitle = 'Dashboard'; break
    case ACL.GetCausePayments.resource: routeTitle = 'Payments'; break
    case ACL.GetDonatorIndex.resource: routeTitle = 'Dashboard'; break
    case ACL.GetAdminIndex.resource: routeTitle = 'Dashboard'; break
    case ACL.Get404.resource: routeTitle = 'Page Unavailable'; break
    case ACL.Get500.resource: routeTitle = 'System Failure'; break
    default:
      logService.error({ resource: resource }, 'Route title build error - resource unknown')
  }
  return routeTitle
}

const getLinkTitle = (resource) => {
  let linkTitle = null
  switch (resource) {
    case ACL.GetShowcase.resource: linkTitle = 'Mining'; break
    case ACL.GetIndex.resource: linkTitle = 'Home'; break
    case ACL.GetExplore.resource: linkTitle = 'Explore'; break
    case ACL.GetFAQ.resource: linkTitle = 'FAQs'; break
    case ACL.GetLogin.resource: linkTitle = 'Sign in'; break
    case ACL.GetRegister.resource: linkTitle = 'Sign up'; break
    case ACL.GetResetPassword.resource: linkTitle = 'Forgot password?'; break
    case ACL.GetCauseIndex.resource: linkTitle = 'Dashboard'; break
    case ACL.GetCausePayments.resource: linkTitle = 'Payments'; break
    case ACL.GetDonatorIndex.resource: linkTitle = 'Dashboard'; break
    case ACL.GetAdminIndex.resource: linkTitle = 'Dashboard'; break
    case ACL.GetLogout.resource: linkTitle = 'Logout'; break
    default:
      logService.error({ resource: resource }, 'Route title build error - resource unknown')
  }
  return linkTitle
}

const getPostResponseContent = (resource) => {
  let content = null
  switch (resource) {
    case ACL.PostRegister.resource:
      content = {
        routeTitle: 'Almost there...',
        message: 'A registration confirmation email has been sent to you. Please follow the steps in the email to complete registration.'
      }
      break
    case ACL.PostResetPassword.resource:
      content = {
        routeTitle: 'Next step...',
        message: 'A reset password confirmation email has been sent. Please follow the steps in the email to reset your password.'
      }
      break
    case ACL.PostResetPasswordConfirm.resource:
      content = {
        routeTitle: 'All done',
        message: 'Your password has been successfully reset. You can now sign in.'
      }
      break
    case ACL.PostCause.resource:
      content = {
        routeTitle: 'All done',
        message: 'Your charity has been successfully updated. Your changes will become visible in a few minutes.'
      }
      break
    case ACL.PostChangePassword.resource:
      content = {
        routeTitle: 'All done',
        message: 'Your password has been successfully changed.'
      }
      break
    default:
      logService.error({ resource: resource }, 'getPostResponseContent build error - resource unknown')
  }
  return content
}

module.exports = (injector) => {
  ACL = injector.ACL
  logService = injector.logService

  return {
    getBrandTitle,
    getPageTitle,
    getRouteTitle,
    getLinkTitle,
    getPostResponseContent
  }
}
