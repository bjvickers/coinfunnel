'use strict'

let inject = null
let TotalsSchema = null

const getTotals = async () => {
  return await _getCurrent() || new TotalsSchema()
}

const getSumAllPayouts = async () => {
  const current = await _getCurrent()
  return (current) ? current.sum_all_payouts : 0
}

const getSumAllMiners = async () => {
  const current = await _getCurrent()
  return (current) ? current.sum_all_miners : 0
}

const persistSumAllPayouts = async (sumAllPayouts) => {
  let schema = await _getCurrent()
  if (!schema) {
    schema = new TotalsSchema()
  }
  schema.sum_all_payouts = sumAllPayouts
  await _persist(schema)
}

const persistSumAllMiners = async (sumAllMiners) => {
  let schema = await _getCurrent()
  if (!schema) {
    schema = new TotalsSchema()
  }
  schema.sum_all_miners = sumAllMiners
  await _persist(schema)
}

const persistSumAllCauseRegistrations = async (sumAllCauseRegistrations) => {
  let schema = await _getCurrent()
  if (!schema) {
    schema = new TotalsSchema()
  }
  schema.sum_all_cause_registrations = sumAllCauseRegistrations
  await _persist(schema)
}

const _getCurrent = () => {
  return new Promise((resolve, reject) => {
    TotalsSchema.findOne({}, async (err, totalsSchema) => {
      if (err) {
        inject.logService.error({ err: err }, 'Error finding existing Totals document')
        return reject(err)
      }
      return resolve(totalsSchema || null)
    })
  })
}

const _persist = (schema) => {
  return new Promise(async (resolve, reject) => {
    schema.save((err) => {
      if (err) {
        inject.logService.error({ err: err, schema: schema }, 'Error saving the Totals document')
        return reject(err)
      }
      return resolve(true)
    })
  })
}

module.exports = (injector) => {
  inject = injector
  TotalsSchema = inject.TotalsSchema

  return {
    getTotals,
    getSumAllPayouts,
    getSumAllMiners,
    persistSumAllPayouts,
    persistSumAllMiners,
    persistSumAllCauseRegistrations
  }
}
