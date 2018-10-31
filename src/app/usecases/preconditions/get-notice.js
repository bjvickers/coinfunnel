'use strict'

const sanitizer = require('sanitizer')

class GetNoticePrecondition {
  constructor (inject) {
    this.inject = inject
  }

  getCleanNoticeId (noticeId) {
    const cleanNoticeId = sanitizer.escape(noticeId)
    return cleanNoticeId
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)

    const isUserAuthorised = this.inject.aclLibrary.isUserAuthorised(req.baseUrl, req.method.toLowerCase(), res.locals.user.role)
    if (!isUserAuthorised) {
      usecase.emit('handleFailedAuth')
      return false
    }

    const cleanNoticeId = this.getCleanNoticeId(req.params.noticeId)

    res.locals.notice = await this.inject.dbService.getNoticeDataMapper().findById(cleanNoticeId)
    if (!res.locals.notice) {
      this.inject.logService.debug({ userId: res.locals.user.id }, 'Notice does not exist')
      usecase.emit('handleNoticeNotFound')
      return false
    }

    res.locals.notice.updateReadStatus(res.locals.user)
    if (res.locals.notice.isRead) {
      this.inject.logService.debug({ userId: res.locals.user.id }, 'Notice has already been read')
      usecase.emit('handleNoticeAlreadyRead')
      return false
    }

    return true
  }
}

module.exports = GetNoticePrecondition
