'use strict'

// Describes the relationship between the (UI) PostLoginSchema and
// the corresponding User model. This is useful for creating
// User model objects from PostLoginSchema objects, as both
// can be passed to the UserFactory which will do the rest.

// User (model) properties on the left
// PostLoginSchema properties on the right
const PostLoginMapping = {
  'id': null,
  'registrationState': null,
  'passwordState': null,
  'email': 'user_email',
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

module.exports = PostLoginMapping
