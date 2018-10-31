'use strict'

const appRootPath = require('app-root-path')
const awilix = require('awilix')
const config = require('config')

// Application and DI
const webAppFramework = require(`${appRootPath}/src/waf`)
const invokeDiContainer = require(`${appRootPath}/src/bin/compose-root`)

// Mocks
const invokeDbService = require(`${appRootPath}/tests/features/mocks/database/data-access-layer`)
const invokeEmailService = require(`${appRootPath}/tests/features/mocks/email/email`)

// Instantiate the DI container
const diContainer = invokeDiContainer()

// Replace services with mocks where necessary
if (config.get('database.use') === 'mock') {
  console.log('Replacing database with mock')
  diContainer.register({ dbService: awilix.asFunction(invokeDbService) })
}
if (config.get('email.use') === 'mock') {
  console.log('Replacing email provider with mock')
  diContainer.register({ emailService: awilix.asFunction(invokeEmailService) })
}

// Connect to the (test) database and search engine
diContainer.cradle.dbService.connect()

// Start the app
const webAppInstance = webAppFramework(diContainer)

// Export a reference to the DI container so that test code can access all classes.
const inject = diContainer.cradle

module.exports = {
  webAppInstance,
  inject
}
