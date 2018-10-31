'use strict'

// Describes the shape of the UI schema and it's corresponding
// constraints
const PostChangePasswordSchema = {
  current_password: 'current_password',
  new_password: 'new_password',
  confirm_new_password: 'confirm_new_password'
}

module.exports = PostChangePasswordSchema
