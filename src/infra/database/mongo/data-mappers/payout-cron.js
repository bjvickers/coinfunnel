'use strict'

let inject = null
let PayoutCronSchema = null

const _getCurrentCause = (schema) => {
  return new Promise((resolve, reject) => {
    PayoutCronSchema.findOne({}, async (err, payoutCronSchema) => {
      if (err) {
        inject.logService.error({ err: err }, 'Error finding existing PayoutCron document')
        return reject(err)
      }
      return resolve(payoutCronSchema || null)
    })
  })
}

const getCurrentCause = async () => {
  inject.logService.debug({}, 'Getting current PayoutCron document')
  const payoutCronSchema = await _getCurrentCause()
  if (!payoutCronSchema) {
    return null
  }
  return inject.dbService.getCauseDataMapper().findById(payoutCronSchema.cause_id)
}

const setCurrentCause = async (cause) => {
  if (!cause) {
    return remove()
  }

  let schema = await _getCurrentCause()
  if (!schema) {
    schema = new PayoutCronSchema()
  }
  schema.cause_id = cause.id
  schema.process_date = new Date()
  await _persist(schema)
}

const _persist = (schema) => {
  return new Promise(async (resolve, reject) => {
    schema.save((err) => {
      if (err) {
        inject.logService.error({ err: err, schema: schema }, 'Error saving the PayoutCron document')
        return reject(err)
      }
      return resolve(true)
    })
  })
}

const remove = () => {
  return new Promise((resolve, reject) => {
    PayoutCronSchema.remove({}, (err) => {
      if (err) {
        inject.logService.error({}, 'Error whilst deleting PayoutCron document')
        return reject(err)
      }
      return resolve(true)
    })
  })
}

const removeAll = async () => {
  try {
    await inject.dbDataMapperDecorator.removeAll(PayoutCronSchema)
    inject.logService.info({}, 'PayoutCron::RemoveAll decorator attached to DAL')
  } catch (err) {
    inject.logService.info({}, 'PayoutCron::RemoveAll decorator not attached to DAL')
  }
}

module.exports = (injector) => {
  inject = injector
  PayoutCronSchema = inject.PayoutCronSchema

  return {
    getCurrentCause,
    setCurrentCause,
    remove,
    removeAll
  }
}
