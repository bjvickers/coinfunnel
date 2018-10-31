'use strict'

class User {
  constructor () {
    this.id = null
    this.registrationState = null
    this.passwordState = null
    this.email = null
    this.firstName = null
    this.lastName = null
    this.password = null
    this.role = null
    this.lastLoggedIn = null
    this.currency = null
    this.noticesRead = []
    this.noticesDeleted = []
  }

  getFullName () {
    return `${this.firstName} ${this.lastName}`
  }

  merge (user) {
    this.id = user.id || this.id
    this.registrationState = user.registrationState || this.registrationState
    this.passwordState = user.passwordState || this.passwordState
    this.email = user.email || this.email
    this.firstName = user.firstName || this.firstName
    this.lastName = user.lastName || this.lastName
    if (user.password) {
      if (!this.password) {
        this.password = user.password
      } else {
        this.password.clearPassword = user.password.clearPassword || this.password.clearPassword
        this.password.encryptedPassword = user.password.encryptedPassword || this.password.encryptedPassword
      }
    }
    this.role = user.role || this.role
    this.lastLoggedIn = user.lastLoggedIn || this.lastLoggedIn
    this.currency = user.currency || this.currency
    this.noticesRead = user.noticesRead.length ? user.noticesRead : this.noticesRead
    this.noticesDeleted = user.noticesDeleted.length ? user.noticesDeleted : this.noticesDeleted
  }

  toJSONWithPassword () {
    const json = this.toJSONWithoutPassword()
    if (this.password) {
      json.password = {
        clearPassword: this.password.clearPassword || null,
        encryptedPassword: this.password.encryptedPassword || null
      }
    }
    return json
  }

  toJSONWithoutPassword () {
    const json = {
      id: this.id,
      registrationState: this.registrationState,
      passwordState: this.passwordState,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: null,
      role: this.role,
      lastLoggedIn: this.lastLoggedIn ? this.lastLoggedIn.toISOString() : null,
      currency: this.currency,
      noticesRead: this.noticesRead,
      noticesDeleted: this.noticesDeleted
    }
    return json
  }
}

module.exports = User
