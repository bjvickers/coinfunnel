'use strict'

const appRootPath = require('app-root-path')
const config = require('config')

let inject = null

const getBrandTitle = () => config.get('app.brand')

const getSubject = (resource) => {
  let subject = null
  switch (resource) {
    case inject.ACL.GetRegisterConfirm.resource:
      subject = `${getBrandTitle()} registration`
      break
    case inject.ACL.GetResetPasswordConfirm.resource:
      subject = `${getBrandTitle()} reset account password`
      break
    case inject.ACL.DeleteAccount.resource:
      subject = `${getBrandTitle()} account deleted`
      break
    default:
      inject.logService.error({ resource: resource }, 'Mail subject build error - resource unknown')
  }
  return subject
}

const getFromAddress = (resource) => {
  let from = null
  switch (resource) {
    case inject.ACL.GetRegisterConfirm.resource:
    case inject.ACL.GetResetPasswordConfirm.resource:
    case inject.ACL.DeleteAccount.resource:
      from = `noreply@${config.get('app.public_dns_domain')}`
      break
    default:
      inject.logService.error({ resource: resource }, 'Mail from-address build error - resource unknown')
  }
  return from
}

const buildEmbeddedLink = (resource, insert) => {
  let link = null
  switch (resource) {
    case inject.ACL.GetRegisterConfirm.resource:
      link = `${config.get('app.public_dns')}${resource}?token=${insert}`
      break
    case inject.ACL.GetResetPasswordConfirm.resource:
      link = `${config.get('app.public_dns')}${resource}?token=${insert}`
      break
    default:
      inject.logService.error({ resource: resource }, 'Mail link build error - resource unknown')
  }
  return link
}

const getTemplate = (resource) => {
  let template = null
  switch (resource) {
    case inject.ACL.GetRegisterConfirm.resource:
      template = `${appRootPath}/src/infra/email/templates/register-confirm.html`
      break
    case inject.ACL.GetResetPasswordConfirm.resource:
      template = `${appRootPath}/src/infra/email/templates/reset-password-confirm.html`
      break
    case inject.ACL.DeleteAccount.resource:
      template = `${appRootPath}/src/infra/email/templates/delete-account-confirm.html`
      break
    default:
      inject.logService.error({ resource: resource }, 'Mail get template error - resource unknown')
  }
  return template
}

module.exports = (injector) => {
  inject = injector
  return {
    getBrandTitle,
    getSubject,
    getFromAddress,
    buildEmbeddedLink,
    getTemplate
  }
}
