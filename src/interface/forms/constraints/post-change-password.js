'use strict'

const PostChangePasswordConstraints = {
  current_password: {
    format: {
      pattern: '[a-zA-Z0-9 ]*',
      message: 'Current password contains invalid characters'
    },
    length: {
      minimum: 10,
      maximum: 60,
      message: 'Current password should be between 10 and 60 characters long'
    }
  },
  new_password: {
    format: {
      pattern: '[a-zA-Z0-9 ]*',
      message: 'New password contains invalid characters'
    },
    length: {
      minimum: 10,
      maximum: 60,
      message: 'New password should be between 10 and 60 characters long'
    }
  },
  confirm_new_password: {
    equality: {
      attribute: 'new_password',
      message: '"New password" does not match "Confirm new password"'
    }
  }
}

module.exports = PostChangePasswordConstraints
