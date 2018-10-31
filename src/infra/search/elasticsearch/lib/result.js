'use strict'

const _ = require('lodash')
const config = require('config')

const RESULTS_PER_PAGE = config.get('search.results_per_page')

let inject = null
let CauseFromSearchTypeMapping = null

const getTotalPageNumber = (response) => {
  return response.hits.total ? Math.ceil(response.hits.total / RESULTS_PER_PAGE) : 1
}

const getNoOfResultsThisPage = (context, response) => {
  if (context.causeSearch.pageSearch.page > getTotalPageNumber(response)) {
    return 0
  }

  let resultsThisPage = null
  const remainingResults = (response.hits.total - ((context.causeSearch.pageSearch.page - 1) * RESULTS_PER_PAGE))
  if (remainingResults >= RESULTS_PER_PAGE) {
    resultsThisPage = RESULTS_PER_PAGE
  } else if (remainingResults <= 0) {
    resultsThisPage = response.hits.total
  } else {
    resultsThisPage = remainingResults
  }
  return resultsThisPage
}

const getCausesFromResponse = (response) => {
  let causes = []
  response.hits.hits.forEach((hit) => {
    causes.push(inject.CauseFactory.createCauseFromSchema(hit, CauseFromSearchTypeMapping))
  })
  return causes
}

const getKeywordSuggestionsFromResponse = (context, response) => {
  let suggestions = []
  response.hits.hits.forEach((hit) => {
    // If one or more of the Cause keywords matches, add them.
    hit._source.keywords.forEach((currentKeyword) => {
      if (currentKeyword.toLowerCase().includes(context.keywordSearch.keywordFilter)) {
        suggestions.push(currentKeyword)
      }
    })

    // If the Cause name matches, add it.
    if (hit._source.name.toLowerCase().includes(context.keywordSearch.keywordFilter)) {
      suggestions.push(hit._source.name)
    }
  })

  return _.sortBy(_.uniq(suggestions))
}

const getCompiledResult = (context, response) => {
  context.totalNumResults = response.hits.total
  context.resultsPerPage = RESULTS_PER_PAGE
  context.totalPageNum = getTotalPageNumber(response)
  context.resultsThisPage = getNoOfResultsThisPage(context, response)
  context.causes = getCausesFromResponse(response)
  return context
}

module.exports = (injector) => {
  inject = injector
  CauseFromSearchTypeMapping = inject.CauseFromSearchTypeMapping
  return {
    getTotalPageNumber,
    getNoOfResultsThisPage,
    getCausesFromResponse,
    getKeywordSuggestionsFromResponse,
    getCompiledResult
  }
}
