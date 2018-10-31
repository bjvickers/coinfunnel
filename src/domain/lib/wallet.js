'use strict'

let inject = null

const createInitialWallet = (userId, currency, address) => {
  const wallet = inject.WalletFactory.create()
  wallet.userId = userId
  wallet.currency = currency
  wallet.address = address
  wallet.creatorType = inject.WalletCreatorTypes.System
  wallet.dateAdded = new Date()
  return wallet
}

const createInitialWalletAddress = () => {
  return '44H9yAwGrsk1keRHeWxBU5DMPXAywpfspgMJPStG4rhk5WF2agu5cee2kGSnTD69oNBipM4AEhqviSRA4VNSjinV5Ar7Ubo'
}

module.exports = (injector) => {
  inject = injector
  return {
    createInitialWallet,
    createInitialWalletAddress
  }
}
