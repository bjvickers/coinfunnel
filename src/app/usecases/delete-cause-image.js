'use strict'

const cloudinary = require('cloudinary')
const EventEmitter = require('events').EventEmitter
const sanitizer = require('sanitizer')

class DeleteCauseImageUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'DeleteCauseImageUseCase'
    this.inject = inject
  }

  logSuccess (userId, userEmail) {
    this.inject.logService.info({
      usecaseName: this.name,
      userId: userId,
      userEmail: userEmail }, 'Success')
  }

  getCleanPublicId (publicImageId) {
    return sanitizer.escape(publicImageId)
  }

  deleteImageOnCRM (dirtyPublicId, cleanPublicId) {
    cloudinary.v2.uploader.destroy(cleanPublicId, (err, result) => {
      if (err) {
        this.inject.logService.error({
          err: err,
          err_message: err.message,
          originalPublicId: dirtyPublicId,
          cleanPublicId: cleanPublicId },
          `Error deleting image in cloudinary`)
      }
    })
  }

  async updateCause (cause, newPrimaryImage) {
    cause.primaryImage = newPrimaryImage ? newPrimaryImage.imageThumb2 : null
    cause.dateModified = new Date()
    await this.inject.dbService.getCauseDataMapper().persist(cause)
  }

  async execute (req, res) {
    try {
      this.inject.logService.debug({}, 'Begin cause image deletion...')
      const preconditionSatisfied = await this.inject.deleteCauseImagePrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      this.inject.logService.debug({}, 'Deleting CauseImage on the CRM...')
      const cleanPublicId = this.getCleanPublicId(req.params.publicImageId)
      this.deleteImageOnCRM(req.params.publicImageId, cleanPublicId)

      this.inject.logService.debug({}, 'Deleting local CauseImage details...')
      const causeImage = await this.inject.dbService.getCauseImageDataMapper().findByPublicId(cleanPublicId)
      const isDeletedImagePrimary = causeImage.isPrimary
      await this.inject.dbService.getCauseImageDataMapper().remove(cleanPublicId)

      // House keeping. If there are CauseImages remaining for the current Cause, then ensure that
      // one of them is selected as primary. Update the Cause accordingly, and the search engine.
      if (isDeletedImagePrimary) {
        this.inject.logService.debug({}, 'CauseImage was a primary image. Setting another CI as primary...')

        let allCauseImages = await this.inject.dbService.getCauseImageDataMapper().findByCauseId(res.locals.cause.id)
        let newPrimaryImage = null

        if (allCauseImages.length) {
          // Set the first image to primary by default.
          newPrimaryImage = allCauseImages[0]
          newPrimaryImage.isPrimary = true
          newPrimaryImage.dateModified = new Date()
          await this.inject.dbService.getCauseImageDataMapper().persist(newPrimaryImage)
        }

        await this.updateCause(res.locals.cause, newPrimaryImage)
      }

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = DeleteCauseImageUseCase
