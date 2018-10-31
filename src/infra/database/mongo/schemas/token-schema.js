'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TokenSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String,
    trim: true,
    required: true
  },
  type: {
    type: String,
    trim: true,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
    expires: 43200 // 12 hours
  }
}, {
  collection: 'token'
})

module.exports = mongoose.model('TokenSchema', TokenSchema)
