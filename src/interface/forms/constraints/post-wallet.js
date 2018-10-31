'use strict'

const PostWalletConstraints = {
  wallet_currency: {
    presence: true,
    inclusion: {
      within: null,
      message: 'Wallet currency is not recognised'
    }
  },
  wallet_address: {
    length: {
      minimum: 95,
      maximum: 110,
      message: 'Wallet address should be between 95 and 106 characters long'
    },
    format: {
      pattern: '[a-zA-Z0-9]*',
      message: 'Wallet address contains invalid characters'
    }
  },
  wallet_creator_type: {
    presence: true,
    inclusion: {
      within: null,
      message: 'Wallet creator type is not recognised'
    }
  }
}

module.exports = (inject) => {
  PostWalletConstraints.wallet_currency.inclusion.within = [ inject.SupportedCurrencies.Monero ]
  PostWalletConstraints.wallet_creator_type.inclusion.within = [ inject.WalletCreatorTypes.User ]
  return PostWalletConstraints
}
