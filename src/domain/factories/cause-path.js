'use strict'

const slug = require('slugg')

let inject = null

const createFromName = (name) => {
  const causePath = new inject.CausePath()
  causePath.path = slug(name)
  return causePath
}

const createFromParts = (path, extension) => {
  const causePath = new inject.CausePath()
  causePath.path = path
  causePath.extension = extension || null
  return causePath
}

module.exports = (injector) => {
  inject = injector
  return {
    createFromName,
    createFromParts
  }
}
