'use strict'

const PostResetPasswordConfirmConstraints = {
  user_password: {
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
  confirm_user_password: {
    equality: {
      attribute: 'user_password',
      message: 'Passwords do not match'
    }
  }
}

module.exports = PostResetPasswordConfirmConstraints
