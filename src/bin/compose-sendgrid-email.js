'use strict'

const appRootPath = require('app-root-path')
const awilix = require('awilix')

const invokeEmailService = require(`${appRootPath}/src/infra/email/sendgrid/email`)

module.exports = () => {
  return {
    emailService: awilix.asFunction(invokeEmailService)
  }
}
