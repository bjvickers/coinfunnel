'use strict'

class CausePath {
  constructor () {
    this.path = null            // E.g. 'housing-for-homeless'
    this.extension = null       // E.g. '1'
  }

  getCombinedPath () {
    return this.path + (this.extension ? `.${this.extension}` : '')
  }

  toJSON () {
    return {
      path: this.path || null,
      ext: this.ext || null,
      combinedPath: this.getCombinedPath()
    }
  }
}

module.exports = CausePath
