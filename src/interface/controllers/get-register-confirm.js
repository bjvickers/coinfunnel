'use strict'

const express = require('express')

let inject = null

const handleSuccess = (req, res) => {
  res.render('register-confirm', { inject: inject, locals: res.locals })
}

const controller = (req, res, next) => {
  inject.getRegisterConfirmUseCase
    .on('handleSuccess', () => {
      res.locals.pageACL = inject.ACL.GetRegisterConfirm
      handleSuccess(req, res)
    })
    .on('handleRedirect', (redirectResource) => {
      res.status(302)
      res.redirect(redirectResource)
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, 'Error handling registration confirmation in get-register-confirm controller')
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
