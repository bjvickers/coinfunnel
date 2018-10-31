'use strict'

const config = require('config')

let inject = null
let CauseSchema = null
let CauseFromDbCauseMapping = null

const RESULTS_PER_PAGE = config.get('search.results_per_page')

const _buildSort = (context) => {
  let sort = null
  if (context.sortSearch.sort === inject.CauseSortTypes.nameAsc) {
    sort = { name_lowercase: 1 }
  } else if (context.sortSearch.sort === inject.CauseSortTypes.nameDesc) {
    sort = { name_lowercase: -1 }
  } else {
    // Newest first
    sort = { date_added: -1 }
  }
  return sort
}

const _getTotalPageNumber = (totalNoResults) => {
  return totalNoResults ? Math.ceil(totalNoResults / RESULTS_PER_PAGE) : 1
}

const search = (context) => {
  return new Promise((resolve, reject) => {
    let match = {
      $and: [
        { is_online: true }
      ]
    }

    if (context.causeSearch.keywordSearch.isValid) {
      const regex = new RegExp(context.causeSearch.keywordSearch.keywordFilter, 'i')
      match.$and.push({ $or: [ { name: regex }, { keywords: regex } ] })
    }

    if (context.causeSearch.countrySearch.isValid) {
      match.$and.push({ country: context.causeSearch.countrySearch.country })
    }

    CauseSchema
      .find(match)
      .skip((context.causeSearch.pageSearch.page - 1) * RESULTS_PER_PAGE)
      .sort(_buildSort(context))
      .exec((err, causeSchemas) => {
        if (err) {
          inject.logService.error({ err: err }, 'Error searching for Causes in database')
          return reject(err)
        }

        // How many skipped?
        const totalSkipped = (context.causeSearch.pageSearch.page - 1) * RESULTS_PER_PAGE

        context.resultsPerPage = RESULTS_PER_PAGE
        context.totalNumResults = causeSchemas.length + totalSkipped
        context.totalPageNum = _getTotalPageNumber(context.totalNumResults)
        context.causes = _resolveAll(causeSchemas.slice(0, RESULTS_PER_PAGE))
        context.resultsThisPage = context.causes.length
        return resolve(context)
      })
  })
}

/**
 * Finds the first Cause added to the database.
 */
const getFirst = () => {
  inject.logService.debug({}, 'Getting first Cause from Cause data mapper')

  return new Promise((resolve, reject) => {
    CauseSchema.find({}, {}, {sort: {date_added: 1}, limit: 1}, (err, causeSchemas) => {
      if (err) {
        inject.logService.error({ err: err }, 'Error finding first Cause in database')
        return reject(err)
      }

      if (causeSchemas && causeSchemas.length === 1) {
        return resolve(_resolve(causeSchemas[0]))
      }
      return resolve(null)
    })
  })
}

/**
 * Finds the next Cause in the database which was added after the Cause
 * passed in.
 * @param {Cause} cause
 */
const getNext = (cause) => {
  inject.logService.debug({}, 'Getting next Cause from Cause data mapper')

  return new Promise((resolve, reject) => {
    CauseSchema.find({date_added: {$gt: cause.dateAdded}}, {}, {sort: {date_added: 1}, limit: 1}, (err, causeSchemas) => {
      if (err) {
        inject.logService.error({ err: err }, 'Error finding next Cause in database')
        return reject(err)
      }

      if (causeSchemas && causeSchemas.length === 1) {
        return resolve(_resolve(causeSchemas[0]))
      }
      return resolve(null)
    })
  })
}

const getLatest = () => {
  return new Promise((resolve, reject) => {
    CauseSchema.find({ is_online: true }, {}, {sort: {date_added: -1}, limit: 3}, (err, causeSchemas) => {
      if (err) {
        inject.logService.error({ err: err }, 'Error finding latest 3 Causes in database')
        return reject(err)
      }

      let results = []
      for (let i = 0; i < causeSchemas.length; i++) {
        results.push(_resolve(causeSchemas[i]))
      }
      return resolve(results)
    })
  })
}

// @todo
// Improve the efficiency of this
const getNoOfCausesOnline = async () => {
  return new Promise((resolve, reject) => {
    CauseSchema.count({ is_online: true }, (err, count) => {
      if (err) {
        inject.logService.error({ err: err }, 'Error counting online Cause documents')
        return reject(err)
      }
      return resolve(count)
    })
  })
}

const findByExternalId = async (externalCauseId) => {
  return _resolve(await _findOne({ cause_external_id: externalCauseId }))
}

const findById = async (id) => {
  return _resolve(await _findOne({ cause_id: id }))
}

const findByUserId = async (userId) => {
  return _resolve(await _findOne({ user_id: userId }))
}

const findByName = async (name) => {
  if (!name) {
    return null
  }
  return _resolve(await _findOne({ name_lowercase: name.toLowerCase() }))
}

const findByCombinedPath = async (combinedPath) => {
  return _resolve(await _findOne({ path_combined: combinedPath }))
}

const findAllByPath = async (path) => {
  let causeSchemas = await _findAll({ path: path })
  if (!causeSchemas) {
    return []
  }
  return causeSchemas.map(currentSchema => inject.CauseFactory.createCauseFromSchema(currentSchema, CauseFromDbCauseMapping))
}

const _findOne = (searchSchema) => {
  return new Promise((resolve, reject) => {
    CauseSchema.findOne(searchSchema, (err, causeSchema) => {
      if (err) {
        inject.logService.error({ err: err, searchSchema: searchSchema }, 'Error locating existing Cause document')
        return reject(err)
      }
      return resolve(causeSchema)
    })
  })
}

const _findAll = (searchSchema) => {
  return new Promise((resolve, reject) => {
    CauseSchema.find(searchSchema, (err, causeSchemas) => {
      if (err) {
        inject.logService.error({ err: err, searchSchema: searchSchema }, 'Error locating existing Cause documents in database')
        return reject(err)
      }
      return resolve(causeSchemas)
    })
  })
}

const _resolveAll = (causeSchemas) => {
  let results = []
  for (let i = 0; i < causeSchemas.length; i++) {
    results.push(inject.CauseFactory.createCauseFromSchema(causeSchemas[i], CauseFromDbCauseMapping))
  }
  return results
}

const _resolve = (causeSchema) => {
  if (!causeSchema) {
    return null
  }
  return inject.CauseFactory.createCauseFromSchema(causeSchema, CauseFromDbCauseMapping)
}

const persist = async (cause) => {
  try {
    let causeSchema = (cause.id) ? await _findOne({ cause_id: cause.id }) : await _findOne({ user_id: cause.userId })
    causeSchema = causeSchema || new CauseSchema()
    return await _persist(cause, causeSchema)
  } catch (err) {
    throw err
  }
}

const _persist = (cause, causeSchema) => {
  return new Promise(async (resolve, reject) => {
    causeSchema.cause_id = causeSchema._id.toString()
    causeSchema.user_id = cause.userId
    causeSchema.is_online = cause.isOnline
    causeSchema.cause_external_id = cause.externalId
    causeSchema.offline_notice = cause.offlineNotice || null
    causeSchema.path = cause.path ? cause.path.path : null
    causeSchema.path_extension = cause.path ? cause.path.extension : null
    causeSchema.path_combined = cause.path ? cause.path.getCombinedPath() : null
    causeSchema.name = cause.name || null
    causeSchema.name_lowercase = cause.name ? cause.name.toLowerCase() : null
    causeSchema.incorporation_id = cause.incorporationId || null
    causeSchema.incorporation_date = cause.incorporationDate || null
    causeSchema.phone = cause.phone || null
    causeSchema.email = cause.email || null
    causeSchema.website = cause.website || null
    causeSchema.address1 = cause.address1 || null
    causeSchema.address2 = cause.address2 || null
    causeSchema.address3 = cause.address3 || null
    causeSchema.country = cause.country || null
    causeSchema.desc = cause.desc || null
    causeSchema.keywords = cause.keywords || []
    causeSchema.date_added = cause.dateAdded || new Date()
    causeSchema.date_modified = cause.dateModified || new Date()
    causeSchema.primary_image = cause.primaryImage || null
    causeSchema.total_payouts = cause.totalPayouts || 0
    causeSchema.total_miners = cause.totalMiners || 0
    causeSchema.verification_state = cause.verificationState || null
    causeSchema.verification_outcome = cause.verificationOutcome || null
    causeSchema.verification_reason = cause.verificationReason || null
    causeSchema.save((err) => {
      if (err) {
        inject.logService.error({ err: err, cause: cause.toJSON() }, 'Error saving the CauseSchema')
        return reject(err)
      }
      return resolve(_resolve(causeSchema))
    })
  })
}

const remove = (cause) => {
  return new Promise((resolve, reject) => {
    CauseSchema.remove({ cause_id: cause.id }, (err) => {
      if (err) {
        inject.logService.error({ err: err, cause: cause.toJSON() }, 'Error whilst deleting cause')
        return reject(err)
      }
      return resolve()
    })
  })
}

const removeAll = async () => {
  try {
    await inject.dbDataMapperDecorator.removeAll(CauseSchema)
    inject.logService.info({}, 'Cause::RemoveAll decorator attached to DAL')
  } catch (err) {
    inject.logService.info({}, 'Cause::RemoveAll decorator not attached to DAL')
  }
}

const calcSumAllPayouts = async () => {
  return new Promise((resolve, reject) => {
    CauseSchema.aggregate(
      { $match: {} },
      { $group: {
        _id: null,
        balance: {
          $sum: '$total_payouts'
        }
      }}, (err, result) => {
        if (err) {
          inject.logService.error({ err: err }, 'Cause::calcSumAllPayouts')
          return reject(err)
        }

        if (!result.length) {
        // No Causes exist yet
          inject.logService.debug({}, 'Cause::calcSumAllPayouts the result was empty')
          return resolve(0)
        }

        return resolve(result[0].balance)
      })
  })
}

module.exports = (injector) => {
  inject = injector
  CauseSchema = inject.CauseSchema
  CauseFromDbCauseMapping = inject.CauseFromDbCauseMapping

  return {
    search,
    getNoOfCausesOnline,
    calcSumAllPayouts,
    getFirst,
    getNext,
    getLatest,
    findById,
    findByExternalId,
    findByUserId,
    findByName,
    findByCombinedPath,
    findAllByPath,
    persist,
    remove,
    removeAll
  }
}
