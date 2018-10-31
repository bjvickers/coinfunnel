'use strict'

class SortSearch {
  constructor (sortLibrary, sortTypes, proposedSort) {
    this.sort =
      sortLibrary.isValidSort(sortTypes, proposedSort)
        ? proposedSort : sortLibrary.getDefaultSortFromType(sortTypes)
  }
}

module.exports = SortSearch
