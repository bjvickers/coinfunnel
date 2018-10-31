'use strict'

let inject = null

const isValidRegistrationState = (state) => {
  let isValid = false
  for (let currentState in inject.UserRegistrationStates) {
    if (inject.UserRegistrationStates[currentState] === state) {
      isValid = true
      break
    }
  }
  return isValid
}

const isValidPasswordState = (state) => {
  let isValid = false
  for (let currentState in inject.UserPasswordStates) {
    if (inject.UserPasswordStates[currentState] === state) {
      isValid = true
      break
    }
  }
  return isValid
}

const isValidRole = (role) => {
  let isValid = false
  for (let currentRole in inject.UserRoles) {
    if (inject.UserRoles[currentRole] === role) {
      isValid = true
      break
    }
  }
  return isValid
}

module.exports = (injector) => {
  inject = injector
  return {
    isValidRegistrationState,
    isValidPasswordState,
    isValidRole
  }
}
