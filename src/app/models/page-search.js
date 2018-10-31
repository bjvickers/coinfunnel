'use strict'

const DEFAULT_PAGE = 1

class PageSearch {
  constructor (page) {
    this.page = this.sanitizePage(page) || DEFAULT_PAGE
  }

  sanitizePage (page) {
    const pageNum = Number(page)
    if (Number.isNaN(pageNum)) {
      return null
    }
    if (!Number.isInteger(pageNum)) {
      return null
    }
    if (pageNum <= 0) {
      return null
    }
    return pageNum
  }
}

module.exports = PageSearch
