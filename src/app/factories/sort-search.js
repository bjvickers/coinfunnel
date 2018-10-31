'use strict'

let inject = null

const createSortSearch = (sortTypes, proposedSort) => {
  return new inject.SortSearch(inject.enumLibrary, sortTypes, proposedSort)
}

module.exports = (injector) => {
  inject = injector
  return {
    createSortSearch
  }
}
