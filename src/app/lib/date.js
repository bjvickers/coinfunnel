'use strict'

/**
 * https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
 */

const dateFormat = require('dateformat')

const formatLong = (date) => {
  return dateFormat(date, 'dddd dS mmmm yyyy')
}

const formatLongWithTime = (date) => {
  return dateFormat(date, 'dddd dS mmmm yyyy, h:MM TT')
}

const formatShort = (date) => {
  return dateFormat(date, 'dS mmmm yyyy')
}

module.exports = {
  formatLong,
  formatLongWithTime,
  formatShort
}
