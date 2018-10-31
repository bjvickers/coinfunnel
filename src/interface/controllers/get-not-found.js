'use strict'

const express = require('express')

let inject = null

const handleSuccess = (req, res) => {
  res.render('404', { inject: inject, locals: res.locals })
}

const controller = (req, res, next) => {
  inject.get404UseCase
    .on('handleSuccess', () => {
      res.status(404)
      res.locals.pageACL = inject.ACL.Get404
      handleSuccess(req, res)
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, 'Error passing through get-not-found controller')
      return next(err)
    })
    .execute(req, res)
}

module.exports = (injector) => {
  inject = injector
  const router = express.Router()
  router.use((req, res, next) => controller(req, res, next))
  return router
}
