'use strict'

let inject = null

const createKeywordSearch = (keyword) => {
  return new inject.KeywordSearch(keyword)
}

module.exports = (injector) => {
  inject = injector
  return {
    createKeywordSearch
  }
}
