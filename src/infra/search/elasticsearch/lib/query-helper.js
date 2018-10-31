'use strict'

const config = require('config')

const INDEX = config.get('search.elasticsearch.index')
const TYPE = config.get('search.elasticsearch.type')
const RESULTS_PER_PAGE = config.get('search.results_per_page')
const MATCH_PHRASE_PREFIX_SLOP = config.get('search.elasticsearch.match_prefix_slop')
const MATCH_PHRASE_PREFIX_MAX_EXPANSIONS = config.get('search.elasticsearch.match_prefix_max_expansions')

let inject = null

const buildQueryHeader = () => {
  return {
    index: INDEX,
    type: TYPE,
    size: RESULTS_PER_PAGE
  }
}

const buildFromPosition = (page) => {
  return (page - 1) * RESULTS_PER_PAGE
}

const buildMultiMatch = (keyword) => {
  return {
    query: keyword,
    type: 'phrase_prefix',
    fields: [ 'name', 'keywords' ],
    slop: MATCH_PHRASE_PREFIX_SLOP,
    max_expansions: MATCH_PHRASE_PREFIX_MAX_EXPANSIONS
  }
}

/**
 * @param {KeywordSearchContext} context
 */
const buildKeywordSort = (context) => {
  // Currently only one KeywordSortTypes, so no need to check
  return [
    { 'name.keyword': { order: 'asc' } }
  ]
}

/**
 * @param {CauseSearchContext} context
 */
const buildCauseSort = (context) => {
  let sort = null
  if (context.sortSearch.sort === inject.CauseSortTypes.nameAsc) {
    sort = [
      { 'name.keyword': { order: 'asc' } }
    ]
  } else if (context.sortSearch.sort === inject.CauseSortTypes.nameDesc) {
    sort = [
      { 'name.keyword': { order: 'desc' } }
    ]
  } else {
    // Newest first
    sort = [
      { dateAdded: { order: 'desc' } }
    ]
  }
  return sort
}

module.exports = (injector) => {
  inject = injector
  return {
    buildQueryHeader,
    buildFromPosition,
    buildMultiMatch,
    buildKeywordSort,
    buildCauseSort
  }
}
