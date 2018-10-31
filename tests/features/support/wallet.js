'use strict'

const { inject } = require('../steps/before-all')
const { postUrl } = require('./network')

const address = 'A464kVGx2Tav4aKyXEiF8qUKAphYxQpMRdWEakRLqN72h7s3oUXaUcrtJ15m6ptssG9KHs9fmM7psLgEeZyZSnwB27iyy60'

const createPostWalletSchema = function (world) {
  const newAddress = address + world.walletIncrement
  world.walletIncrement++
  return {
    wallet_currency: inject.SupportedCurrencies.Monero,
    wallet_address: newAddress,
    wallet_creator_type: inject.WalletCreatorTypes.User
  }
}

const createInvalidWalletAddress = function (typeOfInvalidity) {
  let wallet = null
  switch (typeOfInvalidity) {
    case 'empty': wallet = ''; break
    case 'invalid': 
      wallet = (new Array(95)).join('a')
      wallet += '<@""*'
      break
    case 'toolong': wallet = (new Array(120)).join('a'); break
    default:
      console.log('Invalid wallet type not recognised in test. EXITING.')
      process.exit(0)
  }
  return wallet
}

const insertPreviousWallets = async (world, noOfPrevWallets) => {
  world.resource = inject.ACL.PostWallet.resource
  for (let i = 0; i < noOfPrevWallets; i++) {
    await postUrl(world, createPostWalletSchema(world))
  }
}

module.exports = {
  createPostWalletSchema,
  createInvalidWalletAddress,
  insertPreviousWallets
}