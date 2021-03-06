'use strict'

const express = require('express')

const controllerName = 'GetNotice'
let inject = null

const handleSuccess = async (res) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(200)
  res.json(inject.aclLibrary.getDashboardResource(res.locals.user.role))
}

const handleFail = (res, status, message) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(status)
  res.json(message)
}

const controller = (req, res, next) => {
  inject.getNoticeUseCase
    .on('handleSuccess', () => {
      handleSuccess(res)
    })
    .on('handleFailedAuth', () => {
      handleFail(res, 403, 'Your session has expired, please refresh the page to sign-in.')
    })
    .on('handleNoticeNotFound', () => {
      handleFail(res, 404, 'Notice not found')
    })
    .on('handleNoticeAlreadyRead', () => {
      handleFail(res, 400, 'Notice already read')
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, `Error passing through ${controllerName} controller`)
      handleFail(res, 500, 'Something went wrong. Sorry for this, please try again.')
    })
    .execute(req, res)
}

module.exports = (injector) => {
  inject = injector
  const router = express.Router()
  router.get('/:noticeId', (req, res, next) => controller(req, res, next))
  return router
}
