'use strict'

const DeleteAccountConstraints = {
  user_password: {
    format: {
      pattern: '[a-zA-Z0-9 ]*',
      message: 'Password contains invalid characters'
    },
    length: {
      minimum: 10,
      maximum: 60,
      message: 'Password should be between 10 and 60 characters long'
    }
  }
}

module.exports = DeleteAccountConstraints
