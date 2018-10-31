'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const NoticeSchema = new Schema({
  id: {
    type: String,
    trim: true,
    index: { unique: true }
  },
  date_added: {
    type: Date,
    required: true,
    default: new Date()
  },
  date_applies: {
    type: Date,
    required: false
  },
  subject: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  }
}, {
  collection: 'notice'
})

module.exports = mongoose.model('NoticeSchema', NoticeSchema)
