'use strict'

let inject = null
let CausePayoutSchema = null

const _getPaymentRecord = (causeId, walletId, txHash) => {
  const searchSchema = {
    cause_id: causeId,
    wallet_id: walletId,
    tx_hash: txHash
  }
  return new Promise((resolve, reject) => {
    CausePayoutSchema.findOne(searchSchema, (err, causePayoutSchema) => {
      if (err) {
        inject.logService.error({ err: err, searchSchema: searchSchema }, 'Error finding existing CausePayout document')
        return reject(err)
      }
      return resolve(causePayoutSchema)
    })
  })
}

const _persist = (schema) => {
  return new Promise(async (resolve, reject) => {
    schema.save((err) => {
      if (err) {
        return reject(err)
      }
      return resolve(true)
    })
  })
}

const _calculateTotalFromPayouts = (causePayoutSchemas) => {
  let total = 0.0
  for (let i = 0; i < causePayoutSchemas.length; i++) {
    total += causePayoutSchemas[i].amount
  }
  return total
}

const getAllPayoutsForCause = (cause) => {
  const searchSchema = {
    cause_id: cause.id
  }
  return new Promise((resolve, reject) => {
    CausePayoutSchema.find(searchSchema, {}, {sort: {date: -1}}, (err, causePayoutSchemas) => {
      if (err) {
        inject.logService.error({ err: err, searchSchema: searchSchema }, 'Error finding CausePayout documents in database')
        return reject(err)
      }

      if (causePayoutSchemas.length === 0) {
        return resolve([])
      }

      return resolve(causePayoutSchemas)
    })
  })
}

const getTotalForCause = (cause) => {
  const searchSchema = {
    cause_id: cause.id,
    confirmed: true
  }
  return new Promise((resolve, reject) => {
    CausePayoutSchema.find(searchSchema, (err, causePayoutSchemas) => {
      if (err) {
        inject.logService.error({ err: err, searchSchema: searchSchema }, 'Error finding CausePayout documents in database')
        return reject(err)
      }

      if (causePayoutSchemas.length === 0) {
        return resolve(0)
      }

      return resolve(_calculateTotalFromPayouts(causePayoutSchemas))
    })
  })
}

/**
 * Creates or updates the payment records for the walletId passed in.
 * @param {string} causeId
 * @param {string} walletId
 * @param {Object} paymentArray
 */
const persist = async (causeId, walletId, paymentArray) => {
  for (let i = 0; i < paymentArray.length; i++) {
    try {
      let record = await _getPaymentRecord(causeId, walletId, paymentArray[i].txHash)
      if (!record) {
        record = new CausePayoutSchema()
        record.cause_id = causeId
        record.wallet_id = walletId
      }
      record.date = paymentArray[i].date
      record.tx_hash = paymentArray[i].txHash
      record.amount = paymentArray[i].amount
      record.confirmed = paymentArray[i].confirmed
      await _persist(record)
    } catch (err) {
      inject.logService.error({
        err: err,
        causeId: causeId,
        walletId: walletId,
        paymentRecord: paymentArray[i] }, 'Error processing CausePayout document')
    }
  }
}

module.exports = (injector) => {
  inject = injector
  CausePayoutSchema = inject.CausePayoutSchema

  return {
    getAllPayoutsForCause,
    getTotalForCause,
    persist
  }
}
