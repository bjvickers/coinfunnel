'use strict'

const _ = require('lodash')

let inject = null

const create = () => {
  return new inject.Cause()
}

const createCauseFromSchema = (schema, schemaToCauseMapping) => {
  const cause = new inject.Cause()
  if (schemaToCauseMapping['id']) {
    cause.id = _.get(schema, schemaToCauseMapping.id)
  }
  if (schemaToCauseMapping['userId']) {
    cause.userId = _.get(schema, schemaToCauseMapping.userId)
  }
  if (schemaToCauseMapping['externalId']) {
    cause.externalId = _.get(schema, schemaToCauseMapping.externalId)
  }
  if (schemaToCauseMapping['isOnline']) {
    cause.isOnline = _.get(schema, schemaToCauseMapping.isOnline)
  }
  if (schemaToCauseMapping['offlineNotice']) {
    cause.offlineNotice = _.get(schema, schemaToCauseMapping.offlineNotice)
  }
  if (schemaToCauseMapping['path']) {
    const path = _.get(schema, schemaToCauseMapping['path.path'])
    const extension = _.get(schema, schemaToCauseMapping['path.extension']) || null
    cause.path = inject.CausePathFactory.createFromParts(path, extension)
  }
  if (schemaToCauseMapping['name']) {
    cause.name = _.get(schema, schemaToCauseMapping.name)
    if (!cause.path) {
      cause.path = inject.CausePathFactory.createFromName(cause.name)
    }
  }
  if (schemaToCauseMapping['incorporationId']) {
    cause.incorporationId = _.get(schema, schemaToCauseMapping.incorporationId)
  }
  if (schemaToCauseMapping['incorporationDate']) {
    cause.incorporationDate = _.get(schema, schemaToCauseMapping.incorporationDate)
  }
  if (schemaToCauseMapping['phone']) {
    cause.phone = _.get(schema, schemaToCauseMapping.phone)
  }
  if (schemaToCauseMapping['email']) {
    cause.email = _.get(schema, schemaToCauseMapping.email)
  }
  if (schemaToCauseMapping['website']) {
    cause.website = _.get(schema, schemaToCauseMapping.website)
  }
  if (schemaToCauseMapping['address1']) {
    cause.address1 = _.get(schema, schemaToCauseMapping.address1)
  }
  if (schemaToCauseMapping['address2']) {
    cause.address2 = _.get(schema, schemaToCauseMapping.address2)
  }
  if (schemaToCauseMapping['address3']) {
    cause.address3 = _.get(schema, schemaToCauseMapping.address3)
  }
  if (schemaToCauseMapping['country']) {
    cause.country = _.get(schema, schemaToCauseMapping.country)
  }
  if (schemaToCauseMapping['desc']) {
    cause.desc = _.get(schema, schemaToCauseMapping.desc)
  }

  if (schemaToCauseMapping['keywords']) {
    const keywordData = _.get(schema, schemaToCauseMapping.keywords)
    if (keywordData) {
      if (keywordData instanceof Array) {
        cause.addKeywords(keywordData)
      } else {
        cause.addKeywords(keywordData.split(','))
      }
    }
  }

  if (schemaToCauseMapping['dateAdded']) {
    const dateString = _.get(schema, schemaToCauseMapping.dateAdded)
    cause.dateAdded = dateString ? new Date(dateString) : null
  }
  if (schemaToCauseMapping['dateModified']) {
    const dateString = _.get(schema, schemaToCauseMapping.dateModified)
    cause.dateModified = dateString ? new Date(dateString) : null
  }
  if (schemaToCauseMapping['primaryImage']) {
    cause.primaryImage = _.get(schema, schemaToCauseMapping.primaryImage)
  }
  if (schemaToCauseMapping['totalPayouts']) {
    cause.totalPayouts = _.get(schema, schemaToCauseMapping.totalPayouts)
  }
  if (schemaToCauseMapping['totalMiners']) {
    cause.totalMiners = _.get(schema, schemaToCauseMapping.totalMiners)
  }

  if (schemaToCauseMapping['verificationState']) {
    cause.verificationState = _.get(schema, schemaToCauseMapping.verificationState)
  }
  if (schemaToCauseMapping['verificationOutcome']) {
    cause.verificationOutcome = _.get(schema, schemaToCauseMapping.verificationOutcome)
  }
  if (schemaToCauseMapping['verificationOutcomeReason']) {
    cause.verificationOutcomeReason = _.get(schema, schemaToCauseMapping.verificationOutcomeReason)
  }
  return cause
}

module.exports = (injector) => {
  inject = injector
  return {
    create,
    createCauseFromSchema
  }
}
