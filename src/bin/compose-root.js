'use strict'

/**
 * This is the composition root for dependency injection
 */
const appRootPath = require('app-root-path')
const awilix = require('awilix')
const config = require('config')

const interfaceDependencies = require('./compose-interface')
const domainDependencies = require('./compose-domain')
const appDependencies = require('./compose-app')
const mongoDependencies = require('./compose-mongo')
const sendgridEmailDependencies = require('./compose-sendgrid-email')
const logService = require(`${appRootPath}/src/infra/log`)

let container = null

module.exports = () => {
  if (container) return container

  container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
  })

  container.register(interfaceDependencies())
  container.register(domainDependencies())
  container.register(appDependencies())

  if (config.get('database.use') === 'mongo') {
    logService.info({}, 'Using Mongo Database')
    container.register(mongoDependencies())
  }

  if (config.get('email.use') === 'mock') {
    logService.info({}, 'Using Email Mock')
    const invokeEmailService = require(`${appRootPath}/src/infra/email/mock/email`)
    container.register({ emailService: awilix.asFunction(invokeEmailService) })
  } else if (config.get('email.use') === 'local') {
    logService.info({}, 'Using Local Email')
    const localEmailDependencies = require('./compose-local-email')
    container.register(localEmailDependencies())
  } else if (config.get('email.use') === 'sendgrid') {
    logService.info({}, 'Using SendGrid Email')
    container.register(sendgridEmailDependencies())
  }

  container.register({ logService: awilix.asValue(logService) })
  return container
}
