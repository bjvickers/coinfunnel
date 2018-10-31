'use strict'

class ToggleCauseOnlineStatusStep {
  constructor (inject) {
    this.inject = inject
  }

  updateCause (cause) {
    cause.isOnline = !cause.isOnline
    cause.dateModified = new Date()
    return cause
  }

  async updateDatabase (cause) {
    await this.inject.dbService.getCauseDataMapper().persist(cause)
  }

  async execute (cause) {
    cause = this.updateCause(cause)
    await this.updateDatabase(cause)
  }
}

module.exports = ToggleCauseOnlineStatusStep
