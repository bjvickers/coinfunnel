'use strict'

/**
 * Decorator provided to attach a removeAll() function. The intention is to support
 * the ability to run the test suite against this service.
*/

let inject = null
let client = null
let queryLibrary = null

const removeAll = () => {
  inject.logService.warn({}, 'Cause::Search::removeAll() requested')

  return new Promise((resolve, reject) => {
    client.deleteByQuery(queryLibrary.buildRemoveAllQuery(), (err, response) => {
      if (err) {
        inject.logService.error({ err: err }, 'Error removing all Causes from search')
        return resolve(null)
      }
      return resolve(null)
    })
  })
}

module.exports = (injector) => {
  inject = injector
  client = inject.searchService.getClient()
  queryLibrary = inject.searchQueryLibrary
  return {
    removeAll
  }
}
