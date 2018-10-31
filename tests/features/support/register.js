'use strict'

const { inject } = require('../steps/before-all')

const createValidRegisterSchema = function () {
  // The object returned needs to have the same shape as the PostRegisterSchema
  return {
    first_name: 'Test',
    last_name: 'Test',
    user_email: 'success@test.com',
    confirm_user_email: 'success@test.com',
    user_password: '1234567890',
    confirm_user_password: '1234567890',
    user_role: inject.UserRoles.cause
  }
}

const createInvalidRegisterName = function (typeOfInvalidity) {
  let invalidName = null
  switch (typeOfInvalidity) {
    case 'empty': invalidName = ''; break
    case 'toolong': invalidName = (new Array(60)).join('a'); break
    default:
      console.log('Invalid user name type not recognised in test. EXITING.')
      process.exit(0)
  }
  return invalidName
}

module.exports = {
  createValidRegisterSchema,
  createInvalidRegisterName
}
