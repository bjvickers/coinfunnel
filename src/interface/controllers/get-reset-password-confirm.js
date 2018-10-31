'use strict'

const express = require('express')

let inject = null

const handleSuccess = (req, res) => {
  res.render('reset-password-confirm', { inject: inject, locals: res.locals })
}

const controller = (req, res, next) => {
  inject.getResetPasswordConfirmUseCase
    .on('handleSuccess', () => {
      res.locals.pageACL = inject.ACL.GetResetPasswordConfirm
      handleSuccess(req, res)
    })
    .on('handleInvalidToken', (tokenId) => {
      inject.logService.error({ tokenId: tokenId }, 'Passing invalid registration token to 404 handler.')
      return next()
    })
    .on('handleRedirect', (redirectResource) => {
      res.status(302)
      res.redirect(redirectResource)
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, 'Error passing through get-reset-password-confirm controller')
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
