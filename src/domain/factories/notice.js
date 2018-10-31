'use strict'

const _ = require('lodash')

let inject = null

const createFromSchema = (schema, schemaToNoticeMapping) => {
  const notice = new inject.Notice()
  if (schemaToNoticeMapping['id']) {
    notice.id = _.get(schema, schemaToNoticeMapping.id)
  }
  if (schemaToNoticeMapping['dateAdded']) {
    notice.dateAdded = _.get(schema, schemaToNoticeMapping.dateAdded)
  }
  if (schemaToNoticeMapping['dateApplies']) {
    notice.dateApplies = _.get(schema, schemaToNoticeMapping.dateApplies)
  }
  if (schemaToNoticeMapping['subject']) {
    notice.subject = _.get(schema, schemaToNoticeMapping.subject)
  }
  if (schemaToNoticeMapping['content']) {
    notice.content = _.get(schema, schemaToNoticeMapping.content)
  }
  if (schemaToNoticeMapping['isRead']) {
    notice.isRead = _.get(schema, schemaToNoticeMapping.isRead)
  }
  if (schemaToNoticeMapping['isDeleted']) {
    notice.isDeleted = _.get(schema, schemaToNoticeMapping.isDeleted)
  }
  return notice
}

module.exports = (injector) => {
  inject = injector
  return {
    createFromSchema
  }
}
