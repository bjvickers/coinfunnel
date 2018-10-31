'use strict'

// Describes the relationship between the (DB) UserSchema and
// the corresponding User model. This is useful for creating
// User model objects from UserSchema objects, as both
// can be passed to the UserFactory which will do the rest.

// User (model) properties on the left
// UserSchema (mongo) properties on the right
const UserFromDbUserMapping = {
  'id': 'user_id',
  'registrationState': 'user_registration_state',
  'passwordState': 'user_password_state',
  'email': 'user_email',
  'firstName': 'first_name',
  'lastName': 'last_name',
  'password': true,
  'password.clearPassword': null,
  'password.encryptedPassword': 'user_encrypted_password',
  'role': 'user_role',
  'lastLoggedIn': 'last_logged_in',
  'currency': 'currency',
  'noticesRead': 'notices_read',
  'noticesDeleted': 'notices_deleted'
}

module.exports = UserFromDbUserMapping
