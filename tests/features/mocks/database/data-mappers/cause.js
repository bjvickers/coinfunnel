'use strict'

const _ = require('lodash')
const config = require('config')

const RESULTS_PER_PAGE = config.get('search.results_per_page')

let inject = null
let causes = []
let nextCauseId = 0

const sortCauseResults = (context) => {
  if (context.sortSearch.sort === inject.CauseSortTypes.newest) {
    context.causes = _.orderBy(context.causes, 'dateAdded', 'desc')
  } else if (context.sortSearch.sort === inject.CauseSortTypes.nameAsc) {
    context.causes.sort((a, b) => a.name.localeCompare(b.name))
  } else if (context.sortSearch.sort === inject.CauseSortTypes.nameDesc) {
    context.causes.sort((a, b) => b.name.localeCompare(a.name))
  }
  return context
}

const sortKeywordSearchResults = (suggestions) => {
  return _.sortBy(suggestions)
}

const getTotalPageNumber = (context) => {
  return context.causes.length ? Math.ceil(context.causes.length / RESULTS_PER_PAGE) : 1
}

const getNoOfResultsThisPage = (context) => {
  if (context.causeSearch.pageSearch.page > getTotalPageNumber(context)) {
    return 0
  }

  let resultsThisPage = null
  const remainingResults = (context.causes.length - ((context.causeSearch.pageSearch.page - 1) * RESULTS_PER_PAGE))
  if (remainingResults >= RESULTS_PER_PAGE) {
    resultsThisPage = RESULTS_PER_PAGE
  }
  else if (remainingResults <= 0) {
    resultsThisPage = context.causes.length
  } else {
    resultsThisPage = remainingResults
  }
  return resultsThisPage
}

const getCausesToDisplay = (context) => {
  let causesToDisplay = []
  if (context.causeSearch.pageSearch.page <= getTotalPageNumber(context)) {
    let startPos = (context.causeSearch.pageSearch.page - 1) * RESULTS_PER_PAGE
    for (let i = 0; i < context.resultsThisPage; i++) {
      causesToDisplay[i] = context.causes[startPos++]
    }
  }
  return causesToDisplay
}

const getCalculatedPaginations = (context) => {
  context.totalNumResults = context.causes.length
  context.totalPageNum = getTotalPageNumber(context)
  context.resultsPerPage = RESULTS_PER_PAGE
  context.resultsThisPage = getNoOfResultsThisPage(context)
  context.causes = getCausesToDisplay(context)
  return context
}

const search = (context) => {
  console.log('Performing full search')
  context.causes = causes
  return getCalculatedPaginations(sortCauseResults(context))
}

const getNoOfCausesOnline = () => {
  let counter = 0;
  for (let i = 0; i < causes.length; i++) {
    if (causes[i].isOnline) {
      counter++
    }
  }
  return counter
}

const getLatest = () => {
  return causes
}

const findById = async (id) => {
  const found = causes.filter(cause => cause.id == id)
  return found.length ? found[0] : null
}

const findByExternalId = async (externalCauseId) => {
  const found = causes.filter(cause => cause.externalId == externalCauseId)
  return found.length ? found[0] : null
}

const findByUserId = async (userId) => {
  const found = causes.filter(cause => cause.userId === userId)
  return found.length ? found[0] : null
}

const findByName = async (name) => {
  const found = causes.filter(cause => cause.name === name)
  return found.length ? found[0] : null
}

const findByCombinedPath = async (combinedPath) => {
  const found = causes.filter(cause => cause.path && (cause.path.getCombinedPath() === combinedPath))
  return found.length ? found[0] : null
}

const findAllByPath = async (path) => {
  const found = causes.filter(cause => cause.path && (cause.path.path === path))
  return found.length ? found : []
}

const persist = async (cause) => {
  if (!cause.id) {
    cause.id = ++nextCauseId
  }

  // Remove existing matching cause, then add the new, for a nice clean replacement.
  remove(cause)
  causes.push(cause)
  return cause
}

const remove = (cause) => {
  causes = causes.filter(storedCause => storedCause.id !== cause.id)
}

const removeAll = () => {
  causes = []
  nextCauseId = 0
}

module.exports = (injector) => {
  inject = injector
  return {
    search,
    getNoOfCausesOnline,
    getLatest,
    findById,
    findByUserId,
    findByExternalId,
    findByName,
    findByCombinedPath,
    findAllByPath,
    persist,
    remove,
    removeAll
  }
}
