'use strict'

class CauseSearchContext {
  constructor (causeSearch, sortSearch) {
    this.causeSearch = causeSearch
    this.sortSearch = sortSearch

    // @todo extract into CauseSearchResult
    this.totalPageNum = null
    this.resultsPerPage = null
    this.totalNumResults = null
    this.resultsThisPage = null
    this.causes = []
  }
}

module.exports = CauseSearchContext
