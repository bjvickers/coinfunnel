'use strict'

// Describes the relationship between the (UI) PostWalletSchema and
// the corresponding Wallet model. This is useful for creating
// Wallet model objects from PostWalletSchema objects, as both
// can be passed to the WalletFactory which will do the rest.

// Wallet (model) properties on the left
// PostWalletSchema properties on the right
const PostWalletMapping = {
  'id': null,
  'userId': null,
  'currency': 'wallet_currency',
  'address': 'wallet_address',
  'creatorType': 'wallet_creator_type',
  'dateAdded': null,
  'dateRemoved': false,
  'miningDonations': null
}

module.exports = PostWalletMapping
