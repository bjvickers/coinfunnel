'use strict'

const sanitizer = require('sanitizer')

class PostCauseImagePrimaryPrecondition {
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

    // Clean the input, retrieve the CauseImage to set to primary
    res.locals.cleanPublicId = sanitizer.escape(req.body.public_id)
    res.locals.causeImage = await this.inject.dbService.getCauseImageDataMapper().findByPublicId(res.locals.cleanPublicId)
    if (!res.locals.causeImage) {
      usecase.emit('handleImageNotFound')
      return false
    }

    // Retrieve the Cause to update it's primaryImage property later
    res.locals.cause = await this.inject.dbService.getCauseDataMapper().findById(res.locals.causeImage.causeId)
    return true
  }
}

module.exports = PostCauseImagePrimaryPrecondition
