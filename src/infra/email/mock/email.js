'use strict'

const sendConfirmRegistrationRequest = (user, token) => {}
const sendResetPasswordRequest = (user, token) => {}
const sendDeleteAccountRequest = (user, walletAddresses) => {}

module.exports = () => {
  return {
    sendConfirmRegistrationRequest,
    sendResetPasswordRequest,
    sendDeleteAccountRequest
  }
}
