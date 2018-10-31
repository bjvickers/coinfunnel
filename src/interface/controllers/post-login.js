'use strict'

const express = require('express')

let inject = null

const handleSuccess = async (res) => {
  const token = await inject.jwtLibrary.createJWToken(res.locals.user)
  inject.cookieLibrary.setCookie(res, token)

  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(200)
  res.json(inject.aclLibrary.getDashboardResource(res.locals.user.role))
}

const handleFail = (res, status, message) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(status)
  res.json(message)
}

const controller = (req, res, next) => {
  inject.postLoginUseCase
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
      handleFail(res, 401, 'Email not confirmed. Another registration confirmation email has now been sent.')
    })
    .on('handleUserPasswordNotConfirmed', () => {
      handleFail(res, 401, 'Password reset request has not been completed. Another password reset email has now been sent.')
    })
    .on('handlePasswordIncorrect', () => {
      handleFail(res, 401, 'Password is incorrect')
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, 'Error handling login checks in post-login controller')
      handleFail(res, 500, 'Please try again')
    })
    .execute(req, res)
}

module.exports = (dependencyInjectionCradle) => {
  inject = dependencyInjectionCradle
  const router = express.Router()
  router.post('/', (req, res, next) => controller(req, res, next))
  return router
}
