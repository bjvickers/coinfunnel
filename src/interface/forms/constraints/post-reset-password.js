'use strict'

const PostResetPasswordConstraints = {
  user_email: {
    presence: true,
    length: {
      maximum: 60,
      message: 'Email address should be less than 60 characters long'
    },
    email: {
      message: 'Email address is invalid'
    }
  }
}

module.exports = PostResetPasswordConstraints
