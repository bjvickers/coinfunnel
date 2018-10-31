'use strict'

const crypto = require('crypto')
const _ = require('lodash')

let inject = null

const createToken = (userId, type) => {
  const token = new inject.Token()
  token.userId = userId
  token.token = crypto.randomBytes(32).toString('hex')
  token.type = type
  return token
}

const createTokenFromSchema = (schema, schemaToCauseMapping) => {
  const token = new inject.Token()
  if (schemaToCauseMapping['userId']) {
    token.userId = _.get(schema, schemaToCauseMapping.userId)
  }
  if (schemaToCauseMapping['token']) {
    token.token = _.get(schema, schemaToCauseMapping.token)
  }
  if (schemaToCauseMapping['type']) {
    token.type = _.get(schema, schemaToCauseMapping.type)
  }
  return token
}

module.exports = (dependencyInjectionCradle) => {
  inject = dependencyInjectionCradle
  return {
    createToken,
    createTokenFromSchema
  }
}
