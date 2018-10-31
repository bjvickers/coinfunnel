'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const WalletSchema = new Schema({
  id: {
    type: String,
    trim: true,
    index: { unique: true }
  },
  user_id: {
    type: String,
    trim: true
  },
  wallet_currency: {
    type: String,
    trim: true
  },
  wallet_address: {
    type: String,
    trim: true
  },
  wallet_creator_type: {
    type: String,
    trim: true
  },
  date_added: {
    type: Date,
    required: true,
    default: new Date()
  },
  date_removed: {
    type: Date,
    required: false,
    default: null
  },
  balance: {
    type: String,
    trim: true,
    default: '0.000000000000'
  },
  mining_donations: {
    type: String,
    trim: true,
    default: '0.000000000000'
  }
}, {
  collection: 'wallet'
})

module.exports = mongoose.model('WalletSchema', WalletSchema)
