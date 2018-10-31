'use strict'

const express = require('express')

let inject = null
const controllerName = 'GetAllAPIV1Controller'

const handleResponse = (res, status, message) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(status)
  res.json(message)
}

const controller = (req, res, next) => {
  inject.getAllAPIV1UseCase
    .on('handleSuccess', (details) => {
      handleResponse(res, 200, details)
    })
    .on('handleFailedValidation', () => {
      handleResponse(res, 400, null)
    })
    .on('handleNotFound', () => {
      handleResponse(res, 404, null)
    })
    .on('handleIsOffline', (offlineNotice) => {
      handleResponse(res, 422, offlineNotice)
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, `Error passing through ${controllerName} controller`)
      handleResponse(res, 500, 'Please try again')
    })
    .execute(req, res)
}

module.exports = (injector) => {
  inject = injector
  const router = express.Router()
  router.get('/:clientId/:externalCauseId', (req, res, next) => controller(req, res, next))
  return router
}
