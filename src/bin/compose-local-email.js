'use strict'

const appRootPath = require('app-root-path')
const awilix = require('awilix')

const invokeEmailService = require(`${appRootPath}/sandbox/infra/email/email`)

module.exports = () => {
  return {
    emailService: awilix.asFunction(invokeEmailService)
  }
}
