'use strict'

// Describes the relationship between the (UI) PostRegisterSchema and
// the corresponding User model. This is useful for creating
// User model objects from PostRegisterSchema objects, as both
// can be passed to the UserFactory which will do the rest.

// User (model) properties on the left
// PostRegisterSchema properties on the right
const PostRegisterMapping = {
  'id': null,
  'registrationState': null,
  'passwordState': null,
  'email': 'user_email',
  'firstName': 'first_name',
  'lastName': 'last_name',
  'password': true,
  'password.clearPassword': 'user_password',
  'password.encryptedPassword': null,
  'role': 'user_role',
  'lastLoggedIn': null,
  'noticesRead': null,
  'noticesDeleted': null
}

module.exports = PostRegisterMapping
