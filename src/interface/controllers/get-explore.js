'use strict'

const express = require('express')
const pagination = require('pagination')

let inject = null

const buildPaginator = (req, res) => {
  return new pagination.TemplatePaginator({
    current: res.locals.context.causeSearch.pageSearch.page,
    rowsPerPage: res.locals.context.resultsPerPage,
    totalResult: res.locals.context.totalNumResults,
    template: function (result) {
      let html = '<ul class="pagination justify-content-center">'

      if (result.pageCount < 2) {
        html += '</ul></div>'
        return html
      }
      if (result.previous) {
        html += '<li class="page-item"><a class="page-link paginator-previous" href="?page=' + result.previous + '">' + this.options.translator('PREVIOUS') + '</a></li>'
      }
      if (result.range.length) {
        for (let i = 0; i < result.range.length; i++) {
          if (result.range[i] === result.current) {
            html += '<li class="page-item active"><a class="page-link" href="?page=' + result.range[i] + '">' + result.range[i] + '</a></li>'
          } else {
            html += '<li class="page-item"><a class="page-link" href="?page=' + result.range[i] + '">' + result.range[i] + '</a></li>'
          }
        }
      }
      if (result.next) {
        html += '<li class="page-item"><a class="page-link paginator-next" href="?page=' + result.next + '">' + this.options.translator('NEXT') + '</a></li>'
      }

      html += '</ul>'
      return html
    }
  })
}

const handleSuccess = (req, res) => {
  res.render('explore', { inject: inject, locals: res.locals })
}

const controller = (req, res, next) => {
  inject.getExploreUseCase
    .on('handleSuccess', () => {
      res.locals.paginator = buildPaginator(req, res)
      res.locals.pageACL = inject.ACL.GetExplore
      handleSuccess(req, res)
    })
    .on('error', (err) => {
      inject.logService.error({ err: err }, 'Error passing through get-explore controller')
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
