'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Records payments from the mining pool
const CausePayoutSchema = new Schema({
  cause_id: {
    type: String,
    trim: true,
    required: true
  },
  wallet_id: {
    type: String,
    trim: true,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: new Date()
  },
  tx_hash: {
    type: String,
    trim: true,
    required: true
  },
  amount: {
    type: String,
    trim: true
  },
  confirmed: {
    type: Boolean,
    required: true
  }
}, {
  collection: 'cause_payout'
})

module.exports = mongoose.model('CausePayoutSchema', CausePayoutSchema)
