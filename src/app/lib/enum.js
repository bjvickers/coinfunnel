'use strict'

let inject = null

const isValidTokenType = (tokenType) => {
  let isValid = false
  for (let currentType in inject.TokenTypes) {
    if (inject.TokenTypes[currentType] === tokenType) {
      isValid = true
      break
    }
  }
  return isValid
}

const isValidSort = (sortTypes, proposedSort) => {
  if ((sortTypes !== inject.CauseSortTypes) && (sortTypes !== inject.KeywordSortTypes)) {
    return false
  }

  let isValid = false
  for (let currentType in sortTypes) {
    if (sortTypes[currentType] === proposedSort) {
      isValid = true
      break
    }
  }
  return isValid
}

const getDefaultSortFromType = (sortTypes) => {
  if (sortTypes === inject.CauseSortTypes) {
    return inject.CauseSortTypes.newest
  } else if (sortTypes === inject.KeywordSortTypes) {
    return inject.KeywordSortTypes.nameAsc
  } else {
    throw Error('Cannot find default sort type from unknown sort type')
  }
}

module.exports = (injector) => {
  inject = injector
  return {
    isValidTokenType,
    isValidSort,
    getDefaultSortFromType
  }
}
