'use strict'

const express = require('express')

let inject = null

const handleSuccess = async (res) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(200)
  res.json(inject.seoLibrary.getPostResponseContent(inject.ACL.PostResetPasswordConfirm.resource))
}

const handleFail = (res, status, message) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(status)
  res.json(message)
}

const controller = (req, res, next) => {
  inject.postResetPasswordConfirmUseCase
    .on('handleSuccess', () => {
      handleSuccess(res)
    })
    .on('handleFailedAuth', () => {
      handleFail(res, 403, null)
    })
    .on('handleFailedValidation', (validationResult) => {
      handleFail(res, 400, validationResult)
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, 'Error handling login checks in post-reset-password-confirm controller')
      handleFail(res, 500, 'Something went wrong. Sorry for this, please try again.')
    })
    .execute(req, res)
}

module.exports = (injector) => {
  inject = injector
  const router = express.Router()
  router.post('/', (req, res, next) => controller(req, res, next))
  return router
}
