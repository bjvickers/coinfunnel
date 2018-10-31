'use strict'

const config = require('config')
const EventEmitter = require('events').EventEmitter

class PostCauseImageUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'PostCauseImageUseCase'
    this.inject = inject
  }

  logSuccess (userId, userEmail) {
    this.inject.logService.info({
      usecaseName: this.name,
      userId: userId,
      userEmail: userEmail }, 'Success')
  }

  async updateCause (cause, newPrimaryImage) {
    cause.primaryImage = newPrimaryImage.imageThumb2
    cause.dateModified = new Date()
    await this.inject.dbService.getCauseDataMapper().persist(cause)
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.postCauseImagePrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      const cloudName = config.get('images.cloudinary.cloud_name')
      const cloudUrl = config.get('images.cloudinary.url')
      const cloudFolder = config.get('images.cloudinary.upload_folder')
      const customThumbImage = config.get('images.cloudinary.custom_thumb_1')
      const customThumb = `${cloudUrl}/${cloudName}/${cloudFolder}/${customThumbImage}/${res.locals.cleanPath}`

      const causeImage = new this.inject.CauseImage()
      causeImage.causeId = res.locals.cause.id
      causeImage.publicId = res.locals.cleanPublicId
      causeImage.isPrimary = (res.locals.causeImages.length === 0)
      causeImage.imageThumb1 = res.locals.cleanThumbnailUrl
      causeImage.imageThumb2 = customThumb
      causeImage.imageFull = res.locals.cleanSecureUrl
      causeImage.dateAdded = new Date()
      causeImage.dateModified = causeImage.dateAdded
      await this.inject.dbService.getCauseImageDataMapper().persist(causeImage)

      // Update the Cause to which this image applies.
      if (causeImage.isPrimary) {
        await this.updateCause(res.locals.cause, causeImage)
      }

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = PostCauseImageUseCase
