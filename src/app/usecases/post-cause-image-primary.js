'use strict'

const EventEmitter = require('events').EventEmitter

class PostCauseImagePrimaryUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'PostCauseImagePrimaryUseCase'
    this.inject = inject
  }

  logSuccess (userId, userEmail) {
    this.inject.logService.info({
      usecaseName: this.name,
      userId: userId,
      userEmail: userEmail }, 'Success')
  }

  async toggleCurrentPrimaryOff (causeId) {
    const currentPrimary = await this.inject.dbService.getCauseImageDataMapper().findPrimaryByCauseId(causeId)
    if (currentPrimary) {
      currentPrimary.isPrimary = false
      currentPrimary.dateModified = new Date()
      await this.inject.dbService.getCauseImageDataMapper().persist(currentPrimary)
    }
  }

  async toggleNewPrimaryOn (causeImage) {
    causeImage.isPrimary = true
    causeImage.dateModified = new Date()
    await this.inject.dbService.getCauseImageDataMapper().persist(causeImage)
  }

  async updateCause (cause, newPrimaryImage) {
    cause.primaryImage = newPrimaryImage.imageThumb2
    cause.dateModified = new Date()
    await this.inject.dbService.getCauseDataMapper().persist(cause)
  }

  async execute (req, res) {
    try {
      this.inject.logService.debug({}, `Beginning image set to primary ${this.name}`)

      const preconditionSatisfied = await this.inject.postCauseImagePrimaryPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      await this.toggleCurrentPrimaryOff(res.locals.cause.id)
      await this.toggleNewPrimaryOn(res.locals.causeImage)
      await this.updateCause(res.locals.cause, res.locals.causeImage)

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = PostCauseImagePrimaryUseCase
