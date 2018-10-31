'use strict'

let inject = null

const createPageSearch = (page) => {
  return new inject.PageSearch(page)
}

module.exports = (injector) => {
  inject = injector
  return {
    createPageSearch
  }
}
