'use strict'

const EventEmitter = require('events').EventEmitter

class Get404UseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'Get404UseCase'
    this.inject = inject
  }

  async execute (req, res) {
    try {
      await this.inject.get404Precondition.execute(req, res, this)
      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = Get404UseCase
