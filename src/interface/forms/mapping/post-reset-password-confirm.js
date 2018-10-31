'use strict'

// Describes the relationship between the (UI) PostResetPasswordConfirmSchema and
// it's corresponding User model. This is useful for creating
// User model objects from PostResetPasswordConfirmSchema objects, as both
// can be passed to the UserFactory which will do the rest.

// User (model) properties on the left
// PostResetPasswordConfirmSchema properties on the right
const PostResetPasswordConfirmMapping = {
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

module.exports = PostResetPasswordConfirmMapping
