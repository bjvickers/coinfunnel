'use strict'

// Describes the relationship between the (UI) PostChangePasswordSchema and
// it's corresponding User model. This is useful for creating
// User model objects from PostChangePasswordSchema objects, as both
// can be passed to the UserFactory which will do the rest.

// User (model) properties on the left
// PostChangePasswordSchema properties on the right
const PostChangePasswordMapping = {
  'id': null,
  'registrationState': null,
  'passwordState': null,
  'email': null,
  'firstName': null,
  'lastName': null,
  'password': true,
  'password.clearPassword': 'new_password',
  'password.encryptedPassword': null,
  'role': null,
  'lastLoggedIn': null,
  'noticesRead': null,
  'noticesDeleted': null
}

module.exports = PostChangePasswordMapping
