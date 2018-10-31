'use strict'

const EventEmitter = require('events').EventEmitter

class DeleteNoticeUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'DeleteNoticeUseCase'
    this.inject = inject
  }

  logSuccess (userId, userEmail) {
    this.inject.logService.info({
      usecaseName: this.name,
      userId: userId,
      userEmail: userEmail }, 'Success')
  }

  async updateUser (req, res) {
    res.locals.user = await this.inject.dbService.getUserDataMapper().find(res.locals.user)
    res.locals.user.noticesDeleted.push(res.locals.notice.id)
  }

  async persistUser (req, res) {
    await this.inject.dbService.getUserDataMapper().persist(res.locals.user)
    await this.inject.updateJwtUserStep.execute(req, res)
  }

  async execute (req, res) {
    try {
      this.inject.logService.debug({}, 'Begin notice deletion')
      const preconditionSatisfied = await this.inject.deleteNoticePrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      await this.updateUser(req, res)
      await this.persistUser(req, res)

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = DeleteNoticeUseCase
