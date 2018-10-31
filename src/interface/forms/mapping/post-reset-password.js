'use strict'

// Describes the relationship between the (UI) PostResetPasswordSchema and
// it's corresponding User model. This is useful for creating
// User model objects from PostResetPasswordSchema objects, as both
// can be passed to the UserFactory which will do the rest.

// User (model) properties on the left
// PostResetPasswordSchema properties on the right
const PostResetPasswordMapping = {
  'id': null,
  'registrationState': null,
  'passwordState': null,
  'email': 'user_email',
  'firstName': null,
  'lastName': null,
  'password': false,
  'password.clearPassword': null,
  'password.encryptedPassword': null,
  'role': null,
  'lastLoggedIn': null,
  'noticesRead': null,
  'noticesDeleted': null
}

module.exports = PostResetPasswordMapping
