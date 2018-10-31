'use strict'

const express = require('express')

const controllerName = 'DeleteAccountController'
let inject = null

const handleSuccess = async (res) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(200)
  res.json(inject.ACL.GetIndex.resource)
}

const handleFail = (res, status, message) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(status)
  res.json(message)
}

const controller = (req, res, next) => {
  inject.deleteAccountUseCase
    .on('handleSuccess', () => {
      handleSuccess(res)
    })
    .on('handleFailedAuth', () => {
      handleFail(res, 403, 'Your session has expired, please refresh the page to sign-in.')
    })
    .on('handleFailedValidation', (validationResult) => {
      handleFail(res, 400, validationResult)
    })
    .on('handleUserNotFound', () => {
      handleFail(res, 400, 'User not found')
    })
    .on('handlePasswordIncorrect', () => {
      handleFail(res, 401, 'Password is incorrect')
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, `Handling error in ${controllerName}`)
      handleFail(res, 500, 'Please try again')
    })
    .execute(req, res)
}

module.exports = (injector) => {
  inject = injector
  const router = express.Router()
  router.delete('/', (req, res, next) => controller(req, res, next))
  return router
}
