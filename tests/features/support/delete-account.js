'use strict'

const createValidDeleteAccountSchema = function () {
  // The object returned needs to have the same shape as the DeleteAccountSchema
  return {
    user_password: null
  }
}

module.exports = {
  createValidDeleteAccountSchema
}
