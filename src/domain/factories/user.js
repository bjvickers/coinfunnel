'use strict'

const _ = require('lodash')

let inject = null

const createUserById = (userId) => {
  const user = new inject.User()
  user.id = userId
  return user
}

const createGuestUser = () => {
  const user = new inject.User()
  user.role = inject.UserRoles.guest
  return user
}

const createUserFromJSON = (json) => {
  const user = new inject.User()
  user.id = json.id || null
  user.registrationState = json.registrationState || null
  user.passwordState = json.passwordState || null
  user.email = json.email || null
  user.firstName = json.firstName
  user.lastName = json.lastName
  if (json.password) {
    user.password = new inject.Password()
    user.password.clearPassword = json.password.clearPassword || null
    user.password.encryptedPassword = json.password.encryptedPassword || null
  }
  user.role = json.role || null
  user.lastLoggedIn = json.lastLoggedIn ? new Date(json.lastLoggedIn) : null
  user.currency = json.currency ? json.currency : null
  user.noticesRead = json.noticesRead || []
  user.noticesDeleted = json.noticesDeleted || []
  return user
}

const createUserFromSchema = (schema, schemaToUserMapping) => {
  const user = new inject.User()
  if (schemaToUserMapping['id']) {
    user.id = _.get(schema, schemaToUserMapping.id)
  }
  if (schemaToUserMapping['registrationState']) {
    user.registrationState = _.get(schema, schemaToUserMapping.registrationState)
  }
  if (schemaToUserMapping['passwordState']) {
    user.passwordState = _.get(schema, schemaToUserMapping.passwordState)
  }
  if (schemaToUserMapping['email']) {
    user.email = _.get(schema, schemaToUserMapping.email)
  }
  if (schemaToUserMapping['firstName']) {
    user.firstName = _.get(schema, schemaToUserMapping.firstName)
  }
  if (schemaToUserMapping['lastName']) {
    user.lastName = _.get(schema, schemaToUserMapping.lastName)
  }
  if (schemaToUserMapping['password']) {
    user.password = new inject.Password()
    if (schemaToUserMapping['password.clearPassword']) {
      user.password.clearPassword = _.get(schema, schemaToUserMapping['password.clearPassword'])
    }
    if (schemaToUserMapping['password.encryptedPassword']) {
      user.password.encryptedPassword = _.get(schema, schemaToUserMapping['password.encryptedPassword']
    )
    }
  }
  if (schemaToUserMapping['role']) {
    user.role = _.get(schema, schemaToUserMapping.role)
  }
  if (schemaToUserMapping['lastLoggedIn']) {
    const dateString = _.get(schema, schemaToUserMapping.lastLoggedIn)
    user.lastLoggedIn = dateString ? new Date(dateString) : null
  }
  if (schemaToUserMapping['currency']) {
    user.currency = _.get(schema, schemaToUserMapping.currency)
  }
  if (schemaToUserMapping['noticesRead']) {
    user.noticesRead = _.get(schema, schemaToUserMapping.noticesRead)
  }
  if (schemaToUserMapping['noticesDeleted']) {
    user.noticesDeleted = _.get(schema, schemaToUserMapping.noticesDeleted)
  }
  return user
}

module.exports = (injector) => {
  inject = injector
  return {
    createUserById,
    createGuestUser,
    createUserFromJSON,
    createUserFromSchema
  }
}
