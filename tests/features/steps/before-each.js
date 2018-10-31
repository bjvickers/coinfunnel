'use strict'

const { Given } = require('cucumber')
const { inject } = require('./before-all')
const { createGuestUser, createCauseUser, createDonatorUser, createAdminUser, createJWTFromUser } = require('../support/user')
const { createPostWalletSchema } = require('../support/wallet')

// This always starts a new test
Given('Im a {string} user', async function (role) {
  const world = this
  world.reset()

  await inject.dbService.getUserDataMapper().removeAll()
  await inject.dbService.getTokenDataMapper().removeAll()
  await inject.dbService.getCauseDataMapper().removeAll()
  await inject.dbService.getWalletDataMapper().removeAll()
  await inject.dbService.getNoticeDataMapper().removeAll()

  // Sanity checks on the test itself.
  if (!inject.userLibrary.isValidRole(role)) {
    console.log('UserRole under test is invalid. EXITING.')
    process.exit(0)
  }

  if (role === inject.UserRoles.guest) {
    return
  } else if (role ===  inject.UserRoles.cause) {
    world.dbUser = createCauseUser(inject)
  } else if (role ===  inject.UserRoles.donator) {
    world.dbUser = createDonatorUser(inject)
  } else if (role ===  inject.UserRoles.admin) {
    world.dbUser = createAdminUser(inject)
  }

  world.dbUser.password.encryptedPassword = await inject.passwordLibrary.getEncPasswordFromClearPassword(world.dbUser.password.clearPassword)
  world.dbUser.merge(await inject.dbService.getUserDataMapper().persist(world.dbUser))
  
  if (role ===  inject.UserRoles.cause) {
    const address = createPostWalletSchema(world).wallet_address
    const wallet = inject.walletLibrary.createInitialWallet(world.dbUser.id, new inject.Monero(), address)
    await inject.dbService.getWalletDataMapper().persist(wallet)

    world.dbCause = inject.CauseFactory.create()
    world.dbCause.userId = world.dbUser.id
    world.dbCause.name = 'Test Charity Inc.'
    world.dbCause.path = inject.CausePathFactory.createFromName(world.dbCause.name)
    world.dbCause.setExternalId('web.example.com')
    world.dbCause = await inject.dbService.getCauseDataMapper().persist(world.dbCause)
  }
})

Given('my account registration is {string}', async function (registrationState) {
  const world = this

  if (!inject.userLibrary.isValidRegistrationState(registrationState)) {
    console.log('UserRegistrationState under test is invalid. EXITING.')
    process.exit(0)
  }

  world.dbUser.registrationState = registrationState
  await inject.dbService.getUserDataMapper().persist(world.dbUser)
})

Given('my password reset status is pre_confirmed', async function () {
  const world = this

  if (!inject.userLibrary.isValidPasswordState('pre_confirmed')) {
    console.log('UserPasswordState under test is invalid. EXITING.')
    process.exit(0)
  }

  world.dbUser.passwordState = inject.UserPasswordStates.pre_confirmed
  await inject.dbService.getUserDataMapper().persist(world.dbUser)
})

Given('my password reset status is confirmed', async function () {
  const world = this

  if (!inject.userLibrary.isValidPasswordState('confirmed')) {
    console.log('UserPasswordState under test is invalid. EXITING.')
    process.exit(0)
  }

  world.dbUser.passwordState = inject.UserPasswordStates.confirmed
  await inject.dbService.getUserDataMapper().persist(world.dbUser)
})

Given('I {string} logged in', async function (loggedInState) {
  const world = this
  if (loggedInState === 'am') {
    world.user = world.dbUser
    world.jwt = await createJWTFromUser(inject, world.user)
  } else if (loggedInState === 'am not') {
    world.user = createGuestUser(inject)
  } else {
    console.log('Session status is unknown. Exiting..')
    process.exit(0)
  }
})

Given('I have a valid reset-password token', async function () {
  const world = this
  const token = inject.TokenFactory.createToken(world.dbUser.id, inject.TokenTypes.reset_password)
  world.token = await inject.dbService.getTokenDataMapper().persist(token)
})

Given('I have an invalid reset-password token', function () {
  const world = this
  world.token = { token: 'thisisaninvalidtoken' }
})

Given('I have a valid register token', async function () {
  const world = this
  const token = inject.TokenFactory.createToken(world.dbUser.id, inject.TokenTypes.registration)
  world.token = await inject.dbService.getTokenDataMapper().persist(token)
})

Given('I have an invalid register token', function () {
  const world = this
  world.token = { token: 'thisisaninvalidtoken' }
})
