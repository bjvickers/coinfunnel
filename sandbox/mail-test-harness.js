'use strict'

/**
 * Test harness used for development only. Not used in formal testing.
 * 
 * Run under the test environment (see command below).
 * 
 * In the ./config/test.json set the 'email.use' property to 'local'
 * 
 * Ensure maildev is currently running and reachable (http://127.0.0.1:1080)
 * 
 * Then run as follows:
 * 
 * NODE_ENV="test" node ./sandbox/mail-test-harness.js
 */

const appRootPath = require('app-root-path')
const awilix = require('awilix')

// Application and dependency injector
const webAppFramework = require(`${appRootPath}/src/waf`)
const invokeDiContainer = require(`${appRootPath}/src/bin/compose-root`)

// Service mocks
const invokeDbService = require(`${appRootPath}/tests/features/mocks/database/data-access-layer`)

// Instantiate the DI container
console.log('Instantiating DI container...')
const diContainer = invokeDiContainer()

// Replace services with mocks
console.log('Replacing database and search-engine with mocks...')
diContainer.register({ dbService: awilix.asFunction(invokeDbService) })

// Connect to the database and search engine
diContainer.cradle.dbService.connect()

// Start the app
console.log('Starting the application...')
const webAppInstance = webAppFramework(diContainer)

// Export a reference to the DI container so that test code can access all classes.
const inject = diContainer.cradle

const sendMail = async () => {
  const user = inject.UserFactory.createUserFromJSON({
    registrationState: inject.UserRegistrationStates.confirmed,
    passwordState: inject.UserPasswordStates.confirmed,
    email: 'thefarang@protonmail.com',
    password: {
      clearPassword: '123456',
      encryptedPassword: '$2a$10$GnjIRyPwbfuHoN96MSt7neUtnzxi6FucuYOS9/ACEIglLEUl8KN8W'
    },
    role: inject.UserRoles.cause
  })

  const token = inject.TokenFactory.createToken(1, inject.TokenTypes.registration)
  await inject.emailService.sendConfirmRegistrationRequest(user, token)
}

console.log('Sending test mail...')
sendMail()
