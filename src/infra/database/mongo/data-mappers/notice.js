'use strict'

const _ = require('lodash')

let inject = null
let NoticeSchema = null
let NoticeFromDbNoticeMapping = null

const findById = async (noticeId) => {
  const noticeSchema = await _findOne({ id: noticeId })
  if (!noticeSchema) {
    return null
  }
  return inject.NoticeFactory.createFromSchema(noticeSchema, NoticeFromDbNoticeMapping)
}

const findAllExpired = async () => {
  const noticeSchemas = await _findAll({ date_applies: { '$lt': new Date() } })
  if (!noticeSchemas) {
    return []
  }

  let notices = []
  for (let i = 0; i < noticeSchemas.length; i++) {
    notices.push(inject.NoticeFactory.createFromSchema(noticeSchemas[i], NoticeFromDbNoticeMapping))
  }
  return notices
}

const findAll = async () => {
  const noticeSchemas = await _findAll({})
  if (!noticeSchemas) {
    return []
  }

  let notices = []
  for (let i = 0; i < noticeSchemas.length; i++) {
    notices.push(inject.NoticeFactory.createFromSchema(noticeSchemas[i], NoticeFromDbNoticeMapping))
  }
  return _.orderBy(notices, 'dateAdded', 'desc')
}

const _findAll = (searchSchema) => {
  return new Promise((resolve, reject) => {
    NoticeSchema.find(searchSchema, (err, noticeSchemas) => {
      if (err) {
        inject.logService.error({ err: err, searchSchema: searchSchema }, 'Error locating notices in database')
        return reject(err)
      }
      return resolve(noticeSchemas)
    })
  })
}

const _findOne = (searchSchema) => {
  return new Promise((resolve, reject) => {
    NoticeSchema.findOne(searchSchema, (err, noticeSchema) => {
      if (err) {
        inject.logService.error({ err: err, searchSchema: searchSchema }, 'Error locating existing Notice in database')
        return reject(err)
      }
      return resolve(noticeSchema)
    })
  })
}

const persist = async (notice) => {
  try {
    const noticeSchema = await _findOne({ id: notice.id }) || new NoticeSchema()
    return await _persist(notice, noticeSchema)
  } catch (err) {
    throw err
  }
}

const _persist = (notice, noticeSchema) => {
  return new Promise(async (resolve, reject) => {
    noticeSchema.id = notice.id
    noticeSchema.date_added = notice.dateAdded
    noticeSchema.date_applies = notice.dateApplies
    noticeSchema.subject = notice.subject
    noticeSchema.content = notice.content
    noticeSchema.save((err) => {
      if (err) {
        inject.logService.error({ err: err, notice: notice.toJSON() }, 'Error saving the NoticeSchema to the database')
        return reject(err)
      }
      return resolve(true)
    })
  })
}

const removeAll = async () => {
  try {
    await inject.dbDataMapperDecorator.removeAll(NoticeSchema)
    inject.logService.info({}, 'Notice::RemoveAll decorator attached to DAL')
  } catch (err) {
    inject.logService.info({}, 'Notice::RemoveAll decorator not attached to DAL')
  }
}

module.exports = (injector) => {
  inject = injector
  NoticeSchema = inject.NoticeSchema
  NoticeFromDbNoticeMapping = inject.NoticeFromDbNoticeMapping
  return {
    findById,
    findAllExpired,
    findAll,
    persist,
    removeAll
  }
}
