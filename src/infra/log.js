'use strict'

const bunyan = require('bunyan')
const config = require('config')

module.exports = bunyan.createLogger({
  name: config.get('app.name'),
  level: config.get('app.log_level')
})
