'use strict'

const countries = require('country-list')()
const EventEmitter = require('events').EventEmitter

class GetCauseIndexUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'GetCauseIndexUseCase'
    this.inject = inject
  }

  async loadUserNotices (req, res) {
    res.locals.notices = await this.inject.dbService.getNoticeDataMapper().findAll()
    res.locals.notices.forEach((notice) => {
      // Update the notices as they apply to the User
      notice.updateReadStatus(res.locals.user)
      notice.updateDeletedStatus(res.locals.user)
    })
    res.locals.notices = res.locals.notices.filter(notice => !notice.isDeleted)
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.getCauseIndexPrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      res.locals.currentWallet = await this.inject.dbService.getWalletDataMapper().findCurrentByUserId(res.locals.user.id)
      res.locals.previousWallets = await this.inject.dbService.getWalletDataMapper().findPreviousByUserId(res.locals.user.id)
      res.locals.cause = await this.inject.dbService.getCauseDataMapper().findByUserId(res.locals.user.id)
      res.locals.causeImages = await this.inject.dbService.getCauseImageDataMapper().findByCauseId(res.locals.cause.id)
      await this.loadUserNotices(req, res)
      res.locals.countries = countries.getNames()

      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = GetCauseIndexUseCase
