'use strict'

const EventEmitter = require('events').EventEmitter

class GetAllAPIV1UseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'GetAllAPIV1UseCase'
    this.inject = inject
  }

  buildResponseBody (cause, causeImages, wallet) {
    return {
      id: cause.externalId,
      name: cause.name,
      incorporationId: cause.incorporationId,
      incorporationDate: cause.incorporationDate,
      phone: cause.phone,
      email: cause.email,
      website: cause.website,
      address1: cause.address1,
      address2: cause.address2,
      address3: cause.address3,
      country: cause.country,
      desc: JSON.stringify(cause.desc),
      image1: causeImages[0] ? causeImages[0].imageFull : null,
      image2: causeImages[1] ? causeImages[1].imageFull : null,
      image3: causeImages[2] ? causeImages[2].imageFull : null,
      totalPayouts: cause.getTotalPayoutsString(),
      totalMiners: cause.totalMiners,
      isOnline: cause.isOnline,
      offlineNotice: cause.offlineNotice,
      wallet: wallet
    }
  }

  async execute (req, res) {
    try {
      const preconditionSatisfied = await this.inject.getAllAPIV1Precondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      const causeImages = await this.inject.dbService.getCauseImageDataMapper().findByCauseId(res.locals.cause.id)
      res.locals.wallet = await this.inject.dbService.getWalletDataMapper().findCurrentByUserId(res.locals.cause.userId)

      this.emit('handleSuccess', this.buildResponseBody(res.locals.cause, causeImages, res.locals.wallet.address))
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = GetAllAPIV1UseCase
