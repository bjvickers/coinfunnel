'use strict'

const countries = require('country-list')()

class CountrySearch {
  constructor (country) {
    this.isValid = this.isCountryValid(country)
    this.country = country
  }

  isCountryValid (country) {
    if (!country) {
      return false
    }

    if (!countries.getCode(country) && country !== 'Taiwan') {
      return false
    }

    return true
  }
}

module.exports = CountrySearch
