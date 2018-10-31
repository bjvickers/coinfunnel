'use strict'

let inject = null

const createCauseSearch = (keywordSearch, countrySearch, pageSearch) => {
  return new inject.CauseSearch(keywordSearch, countrySearch, pageSearch)
}

const createCauseSearchContext = (causeSearch, sortSearch) => {
  return new inject.CauseSearchContext(causeSearch, sortSearch)
}

module.exports = (injector) => {
  inject = injector
  return {
    createCauseSearch,
    createCauseSearchContext
  }
}
