'use strict'

let inject = null

const createCountrySearch = (country) => {
  return new inject.CountrySearch(country)
}

module.exports = (injector) => {
  inject = injector
  return {
    createCountrySearch
  }
}
