'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CauseImageSchema = new Schema({
  cause_id: {
    type: String,
    trim: true,
    required: true
  },
  public_id: {
    type: String,
    trim: true
  },
  is_primary: {
    type: Boolean,
    default: false,
    required: true
  },
  image_thumb_1: {
    type: String,
    trim: true,
    default: null
  },
  image_thumb_2: {
    type: String,
    trim: true,
    default: null
  },
  image_full: {
    type: String,
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
  }
}, {
  collection: 'cause_image'
})

module.exports = mongoose.model('CauseImageSchema', CauseImageSchema)
