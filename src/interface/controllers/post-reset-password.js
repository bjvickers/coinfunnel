'use strict'

const express = require('express')

let inject = null

const handleSuccess = async (res) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(200)
  res.json(inject.seoLibrary.getPostResponseContent(inject.ACL.PostResetPassword.resource))
}

const handleFail = (res, status, message) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(status)
  res.json(message)
}

const controller = (req, res, next) => {
  inject.postResetPasswordUseCase
    .on('handleSuccess', () => {
      handleSuccess(res)
    })
    .on('handleFailedAuth', () => {
      handleFail(res, 403, null)
    })
    .on('handleFailedRecaptcha', () => {
      handleFail(res, 400, `The "I'm not a robot" check reported suspicious activity. Please try again.`)
    })
    .on('handleFailedValidation', (validationResult) => {
      handleFail(res, 400, validationResult)
    })
    .on('handleUserNotFound', () => {
      handleFail(res, 400, 'User not found')
    })
    .on('handleUserNotConfirmed', () => {
      handleFail(res, 401, 'Email not confirmed. Another registration request email has now been sent to you.')
    })
    .on('handleUserPasswordNotConfirmed', () => {
      handleFail(res, 401, 'Password reset request is already in progress. Another password reset email has now been sent.')
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, 'Error handling login checks in post-reset-password controller')
      handleFail(res, 500, 'Please try again')
    })
    .execute(req, res)
}

module.exports = (injector) => {
  inject = injector
  const router = express.Router()
  router.post('/', (req, res, next) => controller(req, res, next))
  return router
}
