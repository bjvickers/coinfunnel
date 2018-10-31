'use strict'

const express = require('express')

const controllerName = 'PostCauseController'
let inject = null

const handleSuccess = async (res) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(200)
  res.json(inject.aclLibrary.getDashboardTabResource(res.locals.user.role, controllerName))
}

const handleFail = (res, status, message) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(status)
  res.json(message)
}

const controller = (req, res, next) => {
  inject.postCauseUseCase
    .on('handleSuccess', () => {
      handleSuccess(res)
    })
    .on('handleFailedAuth', () => {
      handleFail(res, 403, 'Your session has expired, please refresh the page to sign-in.')
    })
    .on('handleBadRequest', () => {
      handleFail(res, 400, null)
    })
    .on('handleFailedValidation', (validationResult) => {
      handleFail(res, 400, validationResult)
    })
    .on('handleCauseNameDuplicate', () => {
      handleFail(res, 400, { cause_name: ['The charity name has already been taken'] })
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, 'Error handling login checks in post-cause controller')
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
