'use strict'

const { createValidEmail } = require('./email')
const { createValidPassword } = require('./password')

const createGuestUser = (inject) => {
  return inject.UserFactory.createGuestUser()
}

const createCauseUser = (inject) => {
  return inject.UserFactory.createUserFromJSON({
    /*id: 1,*/
    registrationState: inject.UserRegistrationStates.confirmed,
    passwordState: inject.UserPasswordStates.confirmed,
    email: createValidEmail(),
    firstName: 'Random',
    lastName: 'Lastname',
    password: {
      clearPassword: createValidPassword(1)
    },
    role: inject.UserRoles.cause,
    lastLoggedIn: null
  })
}

const createDonatorUser = (inject) => {
  const user = createCauseUser(inject)
  user.role = inject.UserRoles.donator
  return user
}

const createAdminUser = (inject) => {
  const user = createCauseUser(inject)
  user.role = inject.UserRoles.admin
  return user
}

const createJWTFromUser = async (inject, user) => {
  return await inject.jwtLibrary.createJWToken(user)
}

module.exports = {
  createGuestUser,
  createCauseUser,
  createDonatorUser,
  createAdminUser,
  createJWTFromUser
}
