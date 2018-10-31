'use strict'

const config = require('config')
const express = require('express')

const controllerName = 'GetCausePaymentsController'
let inject = null

const handleSuccess = (req, res) => {
  res.render('cause/payments', { inject: inject, locals: res.locals, config: config })
}

const controller = (req, res, next) => {
  inject.getCausePaymentsUseCase
    .on('handleSuccess', () => {
      res.locals.pageACL = inject.ACL.GetCausePayments
      handleSuccess(req, res)
    })
    .on('handleRedirect', (redirectResource) => {
      res.status(302)
      res.redirect(redirectResource)
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, `Error caught by ${controllerName}`)
      return next(err)
    })
    .execute(req, res)
}

module.exports = (injector) => {
  inject = injector
  const router = express.Router()
  router.get('/', (req, res, next) => controller(req, res, next))
  return router
}
