'use strict'

class Wallet {
  constructor () {
    this.id = null
    this.userId = null
    this.currency = null
    this.address = null
    this.creatorType = null
    this.dateAdded = null
    this.dateRemoved = null
    this.balance = '0.000000000000'
    this.miningDonations = '0.000000000000' // piconero, units of monero
  }

  merge (wallet) {
    this.id = wallet.id || this.id
    this.userId = wallet.userId || this.userId
    this.currency = wallet.currency || this.currency
    this.address = wallet.address || this.address
    this.creatorType = wallet.creatorType || this.creatorType
    this.dateAdded = wallet.dateAdded || this.dateAdded
    this.dateRemoved = wallet.dateRemoved || this.dateRemoved
    this.balance = wallet.balance || this.balance
    this.miningDonations = wallet.miningDonations || this.miningDonations
  }

  toJSON () {
    const json = {
      id: this.id,
      userId: this.userId,
      currency: this.currency.getCurrency(),
      address: this.address,
      creatorType: this.creatorType,
      dateAdded: this.dateAdded ? this.dateAdded.toISOString() : null,
      dateRemoved: this.dateRemoved ? this.dateRemoved.toISOString() : null,
      balance: this.balance,
      miningDonations: this.miningDonations
    }
    return json
  }
}

module.exports = Wallet
