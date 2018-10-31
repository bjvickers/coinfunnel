'use strict'

const config = require('config')

let inject = null
let client = null
let queryLibrary = null
let resultLibrary = null

const getNoOfCauses = () => {
  inject.logService.debug({}, 'Performing count of Causes')

  return new Promise((resolve, reject) => {
    client.count({ index: config.get('search.elasticsearch.index') }, (err, response, status) => {
      if (err) {
        inject.logService.error({}, 'Error counting Causes')
        return reject(err)
      }

      inject.logService.debug({ count: response.count }, 'Successfully counted number of Causes')
      return resolve(response.count)
    })
  })
}

const persist = (cause) => {
  inject.logService.debug({}, 'Performing cause persist')

  return new Promise((resolve, reject) => {
    client.index(queryLibrary.buildPersistQuery(cause), (err, response, status) => {
      if (err) {
        inject.logService.error({ err: err, status: status, userId: cause.userId }, 'Error persisting Cause')
        return reject(err)
      }

      inject.logService.debug({ causeId: response._id, userId: cause.userId }, 'Successfully persisted Cause')
      return resolve(cause)
    })
  })
}

const search = (context) => {
  inject.logService.debug({}, 'Performing match-all cause search')

  return new Promise((resolve, reject) => {
    client.search(queryLibrary.buildMatchAllQuery(context), (err, response, status) => {
      if (err) {
        inject.logService.error({ err: err, status: status }, 'Error searching Causes')
        return reject(err)
      }
      return resolve(resultLibrary.getCompiledResult(context, response))
    })
  })
}

const searchFiltered = (context) => {
  inject.logService.debug({}, 'Performing filtered cause search')

  return new Promise((resolve, reject) => {
    client.search(queryLibrary.buildFilteredQuery(context), (err, response, status) => {
      if (err) {
        inject.logService.error({ err: err, status: status }, 'Error searching filtered Causes')
        return reject(err)
      }
      return resolve(resultLibrary.getCompiledResult(context, response))
    })
  })
}

const searchFilteredKeywords = (context) => {
  inject.logService.debug({}, 'Performing filtered keywords search')

  return new Promise((resolve, reject) => {
    client.search(queryLibrary.buildKeywordSuggestionQuery(context), (err, response, status) => {
      if (err) {
        inject.logService.error({ err: err, status: status }, 'Error searching filtered Causes')
        return reject(err)
      }
      return resolve(resultLibrary.getKeywordSuggestionsFromResponse(context, response))
    })
  })
}

const remove = (cause) => {
  return new Promise((resolve, reject) => {
    client.deleteByQuery(queryLibrary.buildRemoveQuery(cause), (err, response) => {
      if (err) {
        inject.logService.error({ err: err, causeId: cause.causeId }, 'Error removing a Cause')
        return resolve(null)
      }
      return resolve(null)
    })
  })
}

const removeAll = async () => {
  try {
    await inject.searchDataMapperDecorator.removeAll()
    inject.logService.info({}, 'RemoveAll decorator attached')
  } catch (err) {
    inject.logService.info({}, 'RemoveAll decorator not attached')
  }
}

module.exports = (injector) => {
  inject = injector
  client = inject.searchService.getClient()
  queryLibrary = inject.searchQueryLibrary
  resultLibrary = inject.searchResultLibrary
  return {
    getNoOfCauses,
    persist,
    search,
    searchFiltered,
    searchFilteredKeywords,
    remove,
    removeAll
  }
}
