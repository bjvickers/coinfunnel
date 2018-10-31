'use strict'

// Describes the relationship between the (UI) DeleteAccountSchema
// and the corresponding User model. This is useful for creating
// User model objects from DeleteAccountSchema objects, as both
// can be passed to the UserFactory which will do the rest.

// User (model) properties on the left
// DeleteAccountSchema properties on the right
const DeleteAccountMapping = {
  'id': null,
  'registrationState': null,
  'passwordState': null,
  'email': null,
  'firstName': null,
  'lastName': null,
  'password': true,
  'password.clearPassword': 'user_password',
  'password.encryptedPassword': null,
  'role': null,
  'lastLoggedIn': null,
  'noticesRead': null,
  'noticesDeleted': null
}

module.exports = DeleteAccountMapping
