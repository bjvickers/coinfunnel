'use strict'

class Token {
  constructor () {
    this.userId = null
    this.token = null
    this.type = null
  }

  update (token) {
    this.userId = token.userId || this.userId
    this.token = token.token || this.token
    this.type = token.type || this.type
  }

  toJSON () {
    return {
      userId: this.userId,
      token: this.token,
      type: this.type
    }
  }
}

module.exports = Token
