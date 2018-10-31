'use strict'

const Currency = require('./currency')

class Monero extends Currency {
  constructor () {
    super()
    this.currency = 'Monero'
    this.plural = 'Monero'
    this.ticker = 'XMR'
    this.symbol = 'ɱ'
  }
}

module.exports = Monero
