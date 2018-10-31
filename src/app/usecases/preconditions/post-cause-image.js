'use strict'

const sanitizer = require('sanitizer')

class PostCauseImagePrecondition {
  constructor (inject) {
    this.inject = inject
  }

  async execute (req, res, usecase) {
    res.locals.user = await this.inject.identifyUserFromJWTTokenStep.execute(req, res)

    const isUserAuthorised = this.inject.aclLibrary.isUserAuthorised(req.baseUrl, req.method.toLowerCase(), res.locals.user.role)
    if (!isUserAuthorised) {
      usecase.emit('handleFailedAuth')
      return false
    }

    res.locals.cause = await this.inject.dbService.getCauseDataMapper().findByUserId(res.locals.user.id)
    res.locals.causeImages = await this.inject.dbService.getCauseImageDataMapper().findByCauseId(res.locals.cause.id)

    if (res.locals.causeImages.length >= 3) {
      usecase.emit('handleFailedTooManyImages')
      return false
    }

    res.locals.cleanPublicId = sanitizer.escape(req.body.public_id)
    res.locals.cleanThumbnailUrl = sanitizer.escape(req.body.thumbnail_url)
    res.locals.cleanSecureUrl = sanitizer.escape(req.body.secure_url)
    res.locals.cleanPath = sanitizer.escape(req.body.path)
    return true
  }
}

module.exports = PostCauseImagePrecondition
