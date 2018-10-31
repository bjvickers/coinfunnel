'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Totalschema = new Schema({
  sum_all_payouts: {
    type: Number,
    default: 0
  },
  sum_all_miners: {
    type: Number,
    default: 0
  },
  sum_all_cause_registrations: {
    type: Number,
    default: 0
  }
}, {
  collection: 'totals'
})

module.exports = mongoose.model('Totalschema', Totalschema)
