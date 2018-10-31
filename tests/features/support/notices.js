'use strict'

const { inject } = require('../steps/before-all')

const buildNotice = (noticeId, expiry) => {
  const notice = new inject.Notice()
  notice.id = noticeId
  notice.dateAdded = new Date()
  notice.dateApplies = expiry
  notice.subject = `Subject for notice ${notice.id}`
  notice.content = `Content for notice ${notice.id}`
  return notice
}

module.exports = {
  buildNotice
}
