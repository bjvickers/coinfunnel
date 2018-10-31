'use strict'

const config = require('config')
const express = require('express')

let inject = null
const controllerName = 'GetShowcase'

const handleSuccess = (req, res) => {
  res.render('showcase', { inject: inject, locals: res.locals })
}

const controller = (req, res, next) => {
  inject.getShowcaseUseCase
    .on('handleSuccess', () => {
      res.locals.clientVersion = config.get('app.client_version')
      res.locals.pageACL = inject.ACL.GetShowcase
      handleSuccess(req, res)
    })
    .on('handleNotFound', () => next())
    .on('error', (err) => {
      inject.logService.error({ err: err }, `Error passing through ${controllerName} controller`)
      return next(err)
    })
    .execute(req, res)
}

module.exports = (injector) => {
  inject = injector
  const router = express.Router()
  router.get('/:causeCombinedPath', (req, res, next) => controller(req, res, next))
  return router
}
