'use strict'

let inject = null

const handleSuccess = (req, res) => {
  res.render('500', { inject: inject, locals: res.locals })
}

const controller = (err, req, res, next) => {
  inject.logService.error({ err: err }, 'Handling error in Error Controller')
  res.status(500)
  res.locals.pageACL = inject.ACL.Get500
  handleSuccess(req, res)
}

module.exports = (injector) => {
  inject = injector
  return (err, req, res, next) => controller(err, req, res, next)
}
