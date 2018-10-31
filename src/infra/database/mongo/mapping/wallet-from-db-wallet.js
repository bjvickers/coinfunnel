'use strict'

// Describes the relationship between the (DB) WalletSchema and
// the corresponding Wallet model. This is useful for creating
// Wallet model objects from WalletSchema objects, as both
// can be passed to the WalletFactory which will do the rest.

// Wallet (model) properties on the left
// WalletSchema (mongo) properties on the right
const WalletFromDbWalletMapping = {
  'id': 'id',
  'userId': 'user_id',
  'currency': 'wallet_currency',
  'address': 'wallet_address',
  'creatorType': 'wallet_creator_type',
  'dateAdded': 'date_added',
  'dateRemoved': 'date_removed',
  'balance': 'balance',
  'miningDonations': 'mining_donations'
}

module.exports = WalletFromDbWalletMapping
