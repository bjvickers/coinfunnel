'use strict'

const PostLoginConstraints = {
  user_email: {
    presence: true,
    length: {
      maximum: 60,
      message: 'Email address should be less than 60 characters long'
    },
    email: {
      message: 'Email address is invalid'
    }
  },
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

module.exports = PostLoginConstraints
