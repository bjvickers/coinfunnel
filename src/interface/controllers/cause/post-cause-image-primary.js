'use strict'

const express = require('express')

const controllerName = 'PostCauseImagePrimaryController'
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
  inject.postCauseImagePrimaryUseCase
    .on('handleSuccess', () => {
      handleSuccess(res)
    })
    .on('handleFailedAuth', () => {
      handleFail(res, 403, 'Your session has expired, please refresh the page to sign-in.')
    })
    .on('handleImageNotFound', () => {
      handleFail(res, 404, 'The image could not be found')
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, `Error handling login checks in ${controllerName}`)
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