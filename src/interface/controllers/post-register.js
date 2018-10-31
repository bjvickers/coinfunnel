'use strict'

const express = require('express')

let inject = null

const handleSuccess = async (res) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(200)
  res.json(inject.seoLibrary.getPostResponseContent(inject.ACL.PostRegister.resource))
}

const handleFail = (res, status, message) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(status)
  res.json(message)
}

const controller = (req, res, next) => {
  inject.postRegisterUseCase
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
    .on('handleUserAlreadyRegistered', () => {
      handleFail(res, 404, 'Email already exists in the system')
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, 'Error handling login checks in post-register controller')
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
