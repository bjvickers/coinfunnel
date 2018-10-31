'use strict'

const EventEmitter = require('events').EventEmitter
const sanitizer = require('sanitizer')

class PostCauseUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'PostCauseUseCase'
    this.inject = inject
  }

  logSuccess (userId, userEmail) {
    this.inject.logService.info({
      usecaseName: this.name,
      userId: userId,
      userEmail: userEmail }, 'Success')
  }

  async updateCause (cause, schema) {
    if (Object.prototype.hasOwnProperty.call(schema, 'cause_name')) {
      cause.name = sanitizer.escape(schema.cause_name)
      if (!cause.name) {
        cause.path = null
      } else {
        cause.path = await this.buildUniqueCausePath(cause.userId, this.inject.CausePathFactory.createFromName(cause.name))
      }
    }
    if (Object.prototype.hasOwnProperty.call(schema, 'cause_incorporation_id')) {
      cause.incorporationId = sanitizer.escape(schema.cause_incorporation_id)
    }
    if (Object.prototype.hasOwnProperty.call(schema, 'cause_incorporation_date')) {
      cause.incorporationDate = sanitizer.escape(schema.cause_incorporation_date)
    }
    if (Object.prototype.hasOwnProperty.call(schema, 'cause_phone')) {
      cause.phone = sanitizer.escape(schema.cause_phone)
    }
    if (Object.prototype.hasOwnProperty.call(schema, 'cause_email')) {
      cause.email = sanitizer.escape(schema.cause_email)
    }
    if (Object.prototype.hasOwnProperty.call(schema, 'cause_website')) {
      cause.website = sanitizer.escape(schema.cause_website)
    }
    if (Object.prototype.hasOwnProperty.call(schema, 'cause_address1')) {
      cause.address1 = sanitizer.escape(schema.cause_address1)
    }
    if (Object.prototype.hasOwnProperty.call(schema, 'cause_address2')) {
      cause.address2 = sanitizer.escape(schema.cause_address2)
    }
    if (Object.prototype.hasOwnProperty.call(schema, 'cause_address3')) {
      cause.address3 = sanitizer.escape(schema.cause_address3)
    }
    if (Object.prototype.hasOwnProperty.call(schema, 'cause_country')) {
      cause.country = sanitizer.escape(schema.cause_country)
    }
    if (Object.prototype.hasOwnProperty.call(schema, 'cause_desc')) {
      cause.desc = sanitizer.escape(schema.cause_desc)
    }

    let keywords = []
    if (Object.prototype.hasOwnProperty.call(schema, 'cause_keyword1')) {
      keywords.push(sanitizer.escape(schema.cause_keyword1))
    }
    if (Object.prototype.hasOwnProperty.call(schema, 'cause_keyword2')) {
      keywords.push(sanitizer.escape(schema.cause_keyword2))
    }
    if (Object.prototype.hasOwnProperty.call(schema, 'cause_keyword3')) {
      keywords.push(sanitizer.escape(schema.cause_keyword3))
    }
    if (keywords.length) {
      cause.keywords = []
      cause.addKeywords(keywords)
    }

    // Look at the current state of the Cause to determine if it should be
    // allowed to preserve it's current isOnline status.
    if (!cause.getIsComplete()) {
      cause.isOnline = false
    }

    // Finally timestamp this update action.
    cause.dateModified = new Date()
    return cause
  }

  /**
   * Checks to ensure that the URL path (derived from the Cause name), is unique.
   * Some characters in the name may be stripped from the URL conversion, which could
   * create duplicate URL paths even though the Cause names are unique. This method
   * will check for duplicates, and if found will identify an extension to append to
   * the URL path to provide uniqueness.
   */
  async buildUniqueCausePath (userId, causePath) {
    const causesWithMatchingPaths = await this.inject.dbService.getCauseDataMapper().findAllByPath(causePath.path)
    if (!causesWithMatchingPaths.length) {
      return causePath
    }

    const alreadyHandled = causesWithMatchingPaths.find(causesWithMatchingPath => causesWithMatchingPath.userId === userId)
    if (alreadyHandled) {
      return causePath
    }

    // When duplicate path names occur, we append a '.[0-9]+' suffix, incrementing
    // for each matching path.
    causePath.extension = causesWithMatchingPaths.length
    return causePath
  }

  async updateDatabase (cause) {
    return this.inject.dbService.getCauseDataMapper().persist(cause)
  }

  async execute (req, res) {
    try {
      this.inject.logService.debug({}, `Starting ${this.name}...`)

      const preconditionSatisfied = await this.inject.postCausePrecondition.execute(req, res, this)
      if (!preconditionSatisfied) {
        return
      }

      res.locals.cause = await this.inject.dbService.getCauseDataMapper().findByUserId(res.locals.user.id)
      res.locals.cause = await this.updateCause(res.locals.cause, req.body)
      await this.updateDatabase(res.locals.cause)

      this.logSuccess(res.locals.user.id, res.locals.user.email)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = PostCauseUseCase
