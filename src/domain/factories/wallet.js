'use strict'

const _ = require('lodash')

let inject = null

const create = () => {
  return new inject.Wallet()
}

const createWalletFromSchema = (schema, schemaToCauseMapping) => {
  const wallet = new inject.Wallet()
  if (schemaToCauseMapping['id']) {
    wallet.id = _.get(schema, schemaToCauseMapping.id)
  }
  if (schemaToCauseMapping['userId']) {
    wallet.userId = _.get(schema, schemaToCauseMapping.userId)
  }
  if (schemaToCauseMapping['currency']) {
    const currency = _.get(schema, schemaToCauseMapping.currency)
    if (currency === inject.SupportedCurrencies.Monero) {
      wallet.currency = new inject.Monero()
    }
  }
  if (schemaToCauseMapping['address']) {
    wallet.address = _.get(schema, schemaToCauseMapping.address)
  }
  if (schemaToCauseMapping['creatorType']) {
    wallet.creatorType = _.get(schema, schemaToCauseMapping.creatorType)
  }
  if (schemaToCauseMapping['dateAdded']) {
    const dateString = _.get(schema, schemaToCauseMapping.dateAdded)
    wallet.dateAdded = dateString ? new Date(dateString) : null
  }
  if (schemaToCauseMapping['dateRemoved']) {
    const dateString = _.get(schema, schemaToCauseMapping.dateRemoved)
    wallet.dateRemoved = dateString ? new Date(dateString) : null
  }
  if (schemaToCauseMapping['balance']) {
    wallet.balance = _.get(schema, schemaToCauseMapping.balance)
  }
  if (schemaToCauseMapping['miningDonations']) {
    wallet.miningDonations = _.get(schema, schemaToCauseMapping.miningDonations)
  }
  return wallet
}

module.exports = (injector) => {
  inject = injector
  return {
    create,
    createWalletFromSchema
  }
}
