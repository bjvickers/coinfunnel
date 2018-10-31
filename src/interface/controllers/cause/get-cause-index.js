'use strict'

const config = require('config')
const express = require('express')

let inject = null

const configureTabSelection = (req, res) => {
  switch (req.params.fromTab) {
    case 'general': res.locals.activeTab = 'general'; break
    case 'charity': res.locals.activeTab = 'charity'; break
    case 'wallet': res.locals.activeTab = 'wallet'; break
    case 'account': res.locals.activeTab = 'account'; break
    default: res.locals.activeTab = 'general'
  }
}

const handleSuccess = (req, res) => {
  configureTabSelection(req, res)
  res.render('cause/index', { inject: inject, locals: res.locals, config: config })
}

const controller = (req, res, next) => {
  inject.getCauseIndexUseCase
    .on('handleSuccess', () => {
      res.locals.pageACL = inject.ACL.GetCauseIndex
      handleSuccess(req, res)
    })
    .on('handleRedirect', (redirectResource) => {
      res.status(302)
      res.redirect(redirectResource)
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, 'Error passing through get-cause-index controller')
      return next(err)
    })
    .execute(req, res)
}

module.exports = (injector) => {
  inject = injector
  const router = express.Router()
  router.get('/', (req, res, next) => controller(req, res, next))
  router.get('/:fromTab', (req, res, next) => controller(req, res, next))
  return router
}
