'use strict'

const express = require('express')

let inject = null

const handleSuccess = (req, res) => {
  res.render('faq', { inject: inject, locals: res.locals })
}

const controller = (req, res, next) => {
  inject.getFAQUseCase
    .on('handleSuccess', () => {
      res.locals.pageACL = inject.ACL.GetFAQ
      handleSuccess(req, res)
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, 'Error passing through get-faq controller')
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
