'use strict'

const config = require('config')

const INDEX = config.get('search.elasticsearch.index')
const TYPE = config.get('search.elasticsearch.type')

let queryHelper = null

/**
 * @param {Cause} context
 */
const buildPersistQuery = (cause) => {
  return {
    index: INDEX,
    type: TYPE,
    body: {
      'causeId': cause.id,
      'userId': cause.userId,
      'path': cause.path.getCombinedPath(),
      'name': cause.name,
      'incorporationId': cause.incorporationId,
      'incorporationDate': cause.incorporationDate,
      'phone': cause.phone,
      'email': cause.email,
      'website': cause.website,
      'keywords': cause.keywords,
      'address1': cause.address1,
      'address2': cause.address2,
      'address3': cause.address3,
      'country': cause.country,
      'desc': cause.desc,
      'dateAdded': cause.dateAdded,
      'dateModified': cause.dateModified,
      'primaryImage': cause.primaryImage,
      'totalPayouts': cause.totalPayouts
    }
  }
}

/**
 * @param {CauseSearchContext} context
 */
const buildMatchAllQuery = (context) => {
  const query = queryHelper.buildQueryHeader()
  query.from = queryHelper.buildFromPosition(context.causeSearch.pageSearch.page)
  query.body = {
    query: {
      match_all: {}
    },
    sort: queryHelper.buildCauseSort(context)
  }
  return query
}

/**
 * @param {CauseSearchContext} context
 */
const buildFilteredQuery = (context) => {
  const query = queryHelper.buildQueryHeader()
  query.from = queryHelper.buildFromPosition(context.causeSearch.pageSearch.page)
  query.body = {
    query: {
      multi_match: queryHelper.buildMultiMatch(context.causeSearch.keywordSearch.keyword)
    },
    sort: queryHelper.buildCauseSort(context)
  }
  return query
}

/**
 * @param {KeywordSearchContext} context
 */
const buildKeywordSuggestionQuery = (context) => {
  const query = queryHelper.buildQueryHeader()
  query.body = {
    query: {
      multi_match: queryHelper.buildMultiMatch(context.keywordSearch.keyword)
    },
    sort: queryHelper.buildKeywordSort(context)
  }
  return query
}

const buildRemoveQuery = (cause) => {
  return {
    index: INDEX,
    body: {
      query: {
        term: {
          causeId: cause.id
        }
      }
    }
  }
}

const buildRemoveAllQuery = () => {
  return {
    index: INDEX,
    body: {
      query: {
        match_all: {}
      }
    }
  }
}

module.exports = (injector) => {
  queryHelper = injector.searchQueryLibraryHelper
  return {
    buildPersistQuery,
    buildMatchAllQuery,
    buildFilteredQuery,
    buildKeywordSuggestionQuery,
    buildRemoveQuery,
    buildRemoveAllQuery
  }
}
