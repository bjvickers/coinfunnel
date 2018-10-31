'use strict'

const config = require('config')
const Decimal = require('decimal.js')

const getDefaultCurrencySymbol = () => {
  const defaultCurrency = config.get('currency_conversion.default')
  switch (defaultCurrency) {
    case 'usd':
      return '$'
    case 'gbp':
      return '£'
    case 'eur':
    default:
      return '€'
  }
}

const getMoneroToDefaultCurrency = (moneroValue, includeCents) => {
  const defaultCurrency = config.get('currency_conversion.default')
  switch (defaultCurrency) {
    case 'usd':
      return getMoneroToUSD(moneroValue, includeCents)
    case 'gbp':
      return getMoneroToGBP(moneroValue, includeCents)
    case 'eur':
    default:
      return getMoneroToEUR(moneroValue, includeCents)
  }
}

const getUserCurrencySymbol = (currency) => {
  switch (currency) {
    case 'usd':
      return '$'
    case 'gbp':
      return '£'
    case 'eur':
    default:
      return '€'
  }
}

const getMoneroToUserCurrency = (moneroValue, currency, includeCents) => {
  switch (currency) {
    case 'usd':
      return getMoneroToUSD(moneroValue, includeCents)
    case 'gbp':
      return getMoneroToGBP(moneroValue, includeCents)
    case 'eur':
    default:
      return getMoneroToEUR(moneroValue, includeCents)
  }
}

const getMoneroToEUR = (moneroValue, includeCents) => {
  const conversion = new Decimal(config.get('currency_conversion.monero.eur'))
  return conversion.times(moneroValue).toFixed(includeCents ? 2 : 0).toString()
}

const getMoneroToUSD = (moneroValue, includeCents) => {
  const conversion = new Decimal(config.get('currency_conversion.monero.usd'))
  return conversion.times(moneroValue).toFixed(includeCents ? 2 : 0).toString()
}

const getMoneroToGBP = (moneroValue, includeCents) => {
  const conversion = new Decimal(config.get('currency_conversion.monero.gbp'))
  return conversion.times(moneroValue).toFixed(includeCents ? 2 : 0).toString()
}

module.exports = {
  getUserCurrencySymbol,
  getMoneroToUserCurrency,
  getDefaultCurrencySymbol,
  getMoneroToDefaultCurrency,
  getMoneroToEUR,
  getMoneroToUSD,
  getMoneroToGBP
}
