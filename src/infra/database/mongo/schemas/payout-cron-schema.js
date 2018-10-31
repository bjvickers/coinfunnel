'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Identifies the next next Cause document to update with the
// latest payment data from the mining pool.
const PayoutCronSchema = new Schema({
  cause_id: {
    type: String,
    trim: true,
    default: null
  },
  process_date: {
    type: Date,
    default: new Date()
  }
}, {
  collection: 'payout_cron'
})

module.exports = mongoose.model('PayoutCronSchema', PayoutCronSchema)
