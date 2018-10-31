'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  user_id: {
    type: String,
    trim: true,
    index: { unique: true }
  },
  user_registration_state: {
    type: String,
    trim: true
  },
  user_password_state: {
    type: String,
    trim: true
  },
  user_email: {
    type: String,
    trim: true,
    required: true,
    index: { unique: true }
  },
  first_name: {
    type: String,
    trim: true
  },
  last_name: {
    type: String,
    trim: true
  },
  user_encrypted_password: {
    type: String,
    trim: true,
    required: true
  },
  user_role: {
    type: String,
    trim: true,
    required: true
  },
  last_logged_in: {
    type: Date
  },
  currency: {
    type: String,
    trim: true,
    default: null
  },
  notices_read: {
    type: [String]
  },
  notices_deleted: {
    type: [String]
  }
}, {
  collection: 'user'
})

module.exports = mongoose.model('UserSchema', UserSchema)
