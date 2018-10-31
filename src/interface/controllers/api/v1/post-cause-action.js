'use strict'

const express = require('express')

let inject = null
const controllerName = 'PostCauseActionAPIV1Controller'

const handleResponse = (res, status, message) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(status)
  res.json(message)
}

const controller = (req, res, next) => {
  inject.postCauseActionAPIV1UseCase
    .on('handleSuccess', () => {
      handleResponse(res, 200, null)
    })
    .on('handleNotFound', () => {
      handleResponse(res, 404, null)
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
  router.post('/', (req, res, next) => controller(req, res, next))
  return router
}
