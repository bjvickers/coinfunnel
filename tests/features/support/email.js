'use strict'

const createValidEmail = () => {
  return 'test@test.com'
}

const createInvalidEmail = (typeOfInvalidity) => {
  let invalidEmail = null
  switch (typeOfInvalidity) {
    case 'empty': invalidEmail = ''; break
    case 'invalid': invalidEmail = 'invalid@email@com'; break
    case 'toolong': invalidEmail = (new Array(60)).join('a') + '@test.com'; break
    default:
      console.log('Invalid email type not recognised')
      process.exit(0)
  }
  return invalidEmail
}

module.exports = {
  createValidEmail,
  createInvalidEmail
}
