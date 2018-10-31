'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CauseSchema = new Schema({
  cause_id: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  user_id: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  cause_external_id: {
    type: String,
    trim: true,
    required: true
  },
  is_online: {
    type: Boolean,
    default: false,
    required: true
  },
  offline_notice: {
    type: String,
    trim: true,
    default: null
  },
  path: {
    type: String,
    trim: true,
    default: null
  },
  path_extension: {
    type: Number,
    default: null
  },
  path_combined: {
    type: String,
    trim: true,
    default: null
  },
  name: {
    type: String,
    trim: true,
    default: null
  },
  name_lowercase: {
    type: String,
    trim: true,
    default: null
  },
  incorporation_id: {
    type: String,
    trim: true,
    default: null
  },
  incorporation_date: {
    type: String,
    trim: true,
    default: null
  },
  phone: {
    type: String,
    trim: true,
    default: null
  },
  email: {
    type: String,
    trim: true,
    default: null
  },
  website: {
    type: String,
    trim: true,
    default: null
  },
  address1: {
    type: String,
    trim: true,
    default: null
  },
  address2: {
    type: String,
    trim: true,
    default: null
  },
  address3: {
    type: String,
    trim: true,
    default: null
  },
  country: {
    type: String,
    trim: true,
    default: null
  },
  desc: {
    type: String,
    trim: true,
    default: null
  },
  keywords: {
    type: [String],
    trim: true,
    default: null
  },
  date_added: {
    type: Date,
    required: true,
    default: new Date()
  },
  date_modified: {
    type: Date,
    required: true,
    default: new Date()
  },
  primary_image: {
    type: String,
    trim: true,
    default: null
  },
  total_payouts: {
    type: Number,
    default: 0
  },
  total_miners: {
    type: Number,
    default: 0
  },
  verification_state: {
    type: String,
    trim: true,
    default: null
  },
  verification_outcome: {
    type: String,
    trim: true,
    default: null
  },
  verification_reason: {
    type: String,
    trim: true,
    default: null
  }
}, {
  collection: 'cause'
})

module.exports = mongoose.model('CauseSchema', CauseSchema)
