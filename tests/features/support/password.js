'use strict'

const createValidPassword = (which) => {
  switch (which) {
    case 1: return '1234567890'
    case 2: return 'The Cat Sat on the Mat'
    case 3: return 'Fiu82nBL22aC'
  }
}

const createInvalidPassword = (typeOfInvalidity) => {
  let invalidPassword = null
  switch (typeOfInvalidity) {
    case 'empty': invalidPassword = ''; break
    case 'tooshort': invalidPassword = 'xxxxxxxxx'; break
    case 'toolong': invalidPassword = (new Array(70)).join('1'); break
    default:
      console.log('Invalid password type not recognised')
      process.exit(0)
  }
  return invalidPassword
}

const createValidChangePasswordSchema = function () {
  // The object returned needs to have the same shape as the PostChangePasswordSchema
  return {
    current_password: createValidPassword(1),
    new_password: createValidPassword(2),
    confirm_new_password: createValidPassword(2)
  }
}

module.exports = {
  createValidPassword,
  createInvalidPassword,
  createValidChangePasswordSchema
}
