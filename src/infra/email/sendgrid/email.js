'use strict'

const sgMail = require('@sendgrid/mail')
const config = require('config')
const ejs = require('ejs')

let inject = null

sgMail.setApiKey(config.get('email.sendgrid.api_key'))

const sendConfirmRegistrationRequest = async (user, token) => {
  try {
    const data = {}
    data.brand = inject.mailLibrary.getBrandTitle()
    data.link = inject.mailLibrary.buildEmbeddedLink(inject.ACL.GetRegisterConfirm.resource, token.token)

    const options = await buildEmail(user, data, inject.ACL.GetRegisterConfirm.resource)
    await sendEmail(options)
  } catch (err) {
    inject.logService.error({ err: err }, 'Email "sendConfirmRegistrationRequest" failed')
  }
}

const sendResetPasswordRequest = async (user, token) => {
  try {
    const data = {}
    data.brand = inject.mailLibrary.getBrandTitle()
    data.link = inject.mailLibrary.buildEmbeddedLink(inject.ACL.GetResetPasswordConfirm.resource, token.token)

    const options = await buildEmail(user, data, inject.ACL.GetResetPasswordConfirm.resource)
    await sendEmail(options)
  } catch (err) {
    inject.logService.error({ err: err }, 'Email "sendResetPasswordRequest" failed')
  }
}

const sendDeleteAccountRequest = async (user, walletAddresses) => {
  try {
    const data = {}
    data.brand = inject.mailLibrary.getBrandTitle()
    data.walletAddresses = walletAddresses

    const options = await buildEmail(user, data, inject.ACL.DeleteAccount.resource)
    await sendEmail(options)
  } catch (err) {
    inject.logService.error({ err: err }, 'Email "sendDeleteAccountRequest" failed')
  }
}

const buildEmail = (user, mailTemplateData, resource) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(inject.mailLibrary.getTemplate(resource), mailTemplateData, {}, (err, htmlBody) => {
      if (err) {
        inject.logService.error({ err: err }, `Failed to build ${resource} template`)
        return reject(err)
      }

      const mailOptions = {
        to: user.email,
        from: inject.mailLibrary.getFromAddress(resource),
        subject: inject.mailLibrary.getSubject(resource),
        html: htmlBody
      }
      return resolve(mailOptions)
    })
  })
}

const sendEmail = (mailOptions) => {
  sgMail.send(mailOptions)
}

module.exports = (injector) => {
  inject = injector
  return {
    sendConfirmRegistrationRequest,
    sendResetPasswordRequest,
    sendDeleteAccountRequest
  }
}
