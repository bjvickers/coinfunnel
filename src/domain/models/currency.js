'use strict'

class Currency {
  constructor () {
    this.currency = null
    this.plural = null
    this.ticker = null
    this.symbol = null
  }

  getCurrency () {
    return this.currency
  }

  getTicker () {
    return this.ticker
  }

  getSymbol () {
    return this.symbol
  }

  getPlural () {
    return this.plural
  }

  toJSON () {
    const json = {
      currency: this.currency,
      ticker: this.ticker,
      symbol: this.symbol,
      plural: this.plural
    }
    return json
  }
}

module.exports = Currency
