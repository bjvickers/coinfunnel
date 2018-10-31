'use strict'

let inject = null

const removeAll = (Schema) => {
  inject.logService.warn({}, 'Database::removeAll() requested')

  return new Promise((resolve, reject) => {
    Schema.remove({}, (err) => {
      if (err) {
        inject.logService.error({}, 'Error removing all documents from the database')
      }
      return resolve(null)
    })
  })
}

module.exports = (injector) => {
  inject = injector
  return {
    removeAll
  }
}
