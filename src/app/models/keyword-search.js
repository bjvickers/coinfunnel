'use strict'

const config = require('config')

const MIN_KEYWORD_LENGTH = config.get('search.min_keyword_length')
const spaceOnlySanitizer = new RegExp('^[ ]+$')

class KeywordSearch {
  constructor (keyword) {
    this.isValid = this.isKeywordValid(keyword)
    this.keyword = this.isValid ? this.createSanitized(keyword) : null
    this.keywordFilter = this.isValid ? this.createFiltering(keyword) : null
  }

  isKeywordValid (keyword) {
    if (!keyword) {
      return false
    }
    const decodedKeyword = decodeURIComponent(keyword)
    if ((decodedKeyword.length < MIN_KEYWORD_LENGTH) || spaceOnlySanitizer.test(decodedKeyword)) {
      return false
    }
    return true
  }

  createSanitized (keyword) {
    return decodeURIComponent(keyword).toLowerCase()
  }

  createFiltering (keyword) {
    return decodeURIComponent(keyword).toLowerCase()
  }
}

module.exports = KeywordSearch
