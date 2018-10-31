'use strict'

const _ = require('lodash')
const countries = require('country-list')()
const EventEmitter = require('events').EventEmitter

class GetExploreUseCase extends EventEmitter {
  constructor (inject) {
    super()
    this.name = 'GetExploreUseCase'
    this.inject = inject
  }

  buildCauseSearchContext (req) {
    const countrySearch = this.inject.countrySearchFactory.createCountrySearch(req.query.country)
    const keywordSearch = this.inject.keywordSearchFactory.createKeywordSearch(req.query.keyword)
    const pageSearch = this.inject.pageSearchFactory.createPageSearch(req.query.page)
    const sortSearch = this.inject.sortSearchFactory.createSortSearch(this.inject.CauseSortTypes, req.query.sort)
    const causeSearch = this.inject.causeSearchFactory.createCauseSearch(keywordSearch, countrySearch, pageSearch)
    return this.inject.causeSearchFactory.createCauseSearchContext(causeSearch, sortSearch)
  }

  getCountryNameList () {
    let countryNames = countries.getNames()

    const taiwanIndex = countryNames.indexOf('Taiwan, Province of China')
    countryNames.splice(taiwanIndex, 1)
    countryNames.push('Taiwan')
    countryNames = _.sortBy(countryNames)

    return ['All countries'].concat(countryNames)
  }

  async execute (req, res) {
    try {
      await this.inject.getExplorePrecondition.execute(req, res, this)

      let context = this.buildCauseSearchContext(req)
      res.locals.context = await this.inject.dbService.getCauseDataMapper().search(context)
      res.locals.countries = this.getCountryNameList()

      this.emit('handleSuccess')
    } catch (err) {
      this.inject.logService.error({ err: err, err_message: err.message }, `Error in ${this.name}`)
      this.emit('error', err)
    }
  }
}

module.exports = GetExploreUseCase
