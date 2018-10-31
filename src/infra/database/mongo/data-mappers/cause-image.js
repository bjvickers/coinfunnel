'use strict'

let inject = null
let CauseImageSchema = null

const findByCauseId = (causeId) => {
  return new Promise((resolve, reject) => {
    CauseImageSchema.find({ cause_id: causeId }, (err, causeImageSchemas) => {
      if (err) {
        inject.logService.error({ err: err }, 'Error finding CauseImages by Cause ID')
        return reject(err)
      }

      let results = []
      for (let i = 0; i < causeImageSchemas.length; i++) {
        results.push(_resolve(causeImageSchemas[i]))
      }
      return resolve(results)
    })
  })
}

const findPrimaryByCauseId = async (causeId) => {
  const schema = await _findOne({ cause_id: causeId, is_primary: true })
  if (!schema) {
    return null
  }
  return _resolve(schema)
}

const findByPublicId = async (publicId) => {
  const schema = await _findOne({ public_id: publicId })
  if (!schema) {
    return null
  }
  return _resolve(schema)
}

const _findOne = (searchSchema) => {
  return new Promise((resolve, reject) => {
    CauseImageSchema.findOne(searchSchema, (err, causeImageSchema) => {
      if (err) {
        inject.logService.error({ err: err, searchSchema: searchSchema }, 'Error locating existing CauseImage document')
        return reject(err)
      }
      return resolve(causeImageSchema)
    })
  })
}

const _resolve = (causeImageSchema) => {
  const causeImage = new inject.CauseImage()
  causeImage.causeId = causeImageSchema.cause_id
  causeImage.publicId = causeImageSchema.public_id
  causeImage.isPrimary = causeImageSchema.is_primary
  causeImage.imageThumb1 = causeImageSchema.image_thumb_1
  causeImage.imageThumb2 = causeImageSchema.image_thumb_2
  causeImage.imageFull = causeImageSchema.image_full
  causeImage.dateAdded = causeImageSchema.date_added
  causeImage.dateModified = causeImageSchema.date_modified
  return causeImage
}

const persist = async (causeImage) => {
  try {
    let causeImageSchema = (causeImage.publicId) ? await _findOne({ public_id: causeImage.publicId }) : null
    causeImageSchema = causeImageSchema || new CauseImageSchema()
    return await _persist(causeImage, causeImageSchema)
  } catch (err) {
    throw err
  }
}

const _persist = (causeImage, causeImageSchema) => {
  return new Promise(async (resolve, reject) => {
    causeImageSchema.public_id = causeImage.publicId
    causeImageSchema.cause_id = causeImage.causeId
    causeImageSchema.is_primary = causeImage.isPrimary
    causeImageSchema.image_thumb_1 = causeImage.imageThumb1
    causeImageSchema.image_thumb_2 = causeImage.imageThumb2
    causeImageSchema.image_full = causeImage.imageFull
    causeImageSchema.date_added = causeImage.dateAdded || new Date()
    causeImageSchema.date_modified = causeImage.dateModified || new Date()
    causeImageSchema.save((err) => {
      if (err) {
        inject.logService.error({ err: err, causeImage: causeImage }, 'Error saving the CauseImageSchema document')
        return reject(err)
      }
      return resolve(true)
    })
  })
}

const remove = (publicId) => {
  return new Promise((resolve, reject) => {
    CauseImageSchema.remove({ public_id: publicId }, (err) => {
      if (err) {
        inject.logService.error({ err: err, public_id: publicId }, 'Error whilst deleting CauseImageSchema document by Public ID')
        return reject(err)
      }
      return resolve(true)
    })
  })
}

const removeAllForCause = (causeId) => {
  return new Promise((resolve, reject) => {
    CauseImageSchema.remove({ cause_id: causeId }, (err) => {
      if (err) {
        inject.logService.error({ err: err, cause_id: causeId }, 'Error whilst deleting all CauseImageSchema documents for Cause')
        return reject(err)
      }
      return resolve(true)
    })
  })
}

const removeAll = async () => {
  try {
    await inject.dbDataMapperDecorator.removeAll(CauseImageSchema)
    inject.logService.info({}, 'CauseImage::RemoveAll decorator attached to DAL')
  } catch (err) {
    inject.logService.info({}, 'CauseImage::RemoveAll decorator not attached to DAL')
  }
}

module.exports = (injector) => {
  inject = injector
  CauseImageSchema = inject.CauseImageSchema

  return {
    findByCauseId,
    findPrimaryByCauseId,
    findByPublicId,
    persist,
    remove,
    removeAllForCause,
    removeAll
  }
}
