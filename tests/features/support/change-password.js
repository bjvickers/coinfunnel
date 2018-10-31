'use strict'

const { createValidPassword } = require('./password')

const createValidChangePasswordSchema = function () {
  // The object returned needs to have the same shape as the PostChangePasswordSchema
  return {
    current_password: createValidPassword(1),
    new_password: createValidPassword(2),
    confirm_new_password: createValidPassword(2)
  }
}

module.exports = {
  createValidChangePasswordSchema
}
