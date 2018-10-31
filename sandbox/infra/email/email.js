'use strict'

const config = require('config')
const ejs = require('ejs')
const nodemailer = require('nodemailer')

let inject = null

const transporter = nodemailer.createTransport({
  host: config.get('email.local.host'),
  port: config.get('email.local.port'),
  ignoreTLS: true
})

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
        from: inject.mailLibrary.getFromAddress(resource),
        to: user.email,
        subject: inject.mailLibrary.getSubject(resource),
        html: htmlBody
      }
      return resolve(mailOptions)
    })
  })
}

const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        inject.logService.error({ err: err }, 'Email failed')
        return reject(err)
      }
      inject.logService.info({ info: info }, 'Email successfully sent')
      return resolve()
    })
  })
}

module.exports = (injector) => {
  inject = injector
  return {
    sendConfirmRegistrationRequest,
    sendResetPasswordRequest,
    sendDeleteAccountRequest
  }
}
