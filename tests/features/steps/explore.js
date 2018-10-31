'use strict'

const expect = require('chai').expect
const config = require('config')
const countries = require('country-list')()
const { Given, When, Then } = require('cucumber')
const { inject } = require('./before-all')
const { getUrl } = require('../support/network')
const { sleep } = require('../support/sleep')
const { charityDefinitions } = require('../support/cause')

Given('there are {int} causes in the search engine', async function (noOfCauses) {
  const world = this
  
  let causes = []
  for (let i = 0; i < noOfCauses; i++) {
    const cause = inject.CauseFactory.create()
    cause.id = i + 1
    cause.userId = i + 1
    cause.isOnline = true
    cause.path = inject.CausePathFactory.createFromName(charityDefinitions[i].name)
    cause.name = charityDefinitions[i].name
    cause.addKeywords(charityDefinitions[i].keywords)
    cause.country = countries.getName('GB')
    cause.dateAdded = charityDefinitions[i].dateAdded
    causes.push(cause)
  }

  // Mix up the order of the causes, for better testing of sort
  causes.sort((a, b) => 0.5 - Math.random())

  for (let i = 0; i < noOfCauses; i++) {
    await inject.dbService.getCauseDataMapper().persist(causes[i])
  }

  // Normally testing is against the mock search service, in which case the
  // delay for indexing is not necessary and should be set to 0. If testing against
  // a real elasticsearch server, then a sleep of around 1300 millis will allow
  // elasticsearch to index the new documents.
  //sleep(config.get('search.test_delay_for_indexing'))
})

Given('I want to view the explore page', function () {
  const world = this
  world.resource = inject.ACL.GetExplore.resource
})

Given('I want to view page {int} of the explore page', function (pageNum) {
  const world = this
  world.resource = inject.ACL.GetExplore.resource
  world.queryPage = `page=${pageNum}`
})

Given('I select {string}', function (sortType) {
  const world = this
  if (sortType === 'name-asc') {
    world.querySort = 'sort=name-asc'
  } else if (sortType === 'name-desc') {
    world.querySort = 'sort=name-desc'
  } else if (sortType === 'newest') {
    world.querySort = 'sort=newest'
  } else {
    console.log('Invalid sort type used in test. EXITING')
    process.exit(0)
  }
})

Given('I specify search for {string}', function (keyword) {
  const world = this
  world.queryKeyword = `keyword=${encodeURIComponent(keyword)}`
})

When('I view the explore page', async function () {
  const world = this
  await getUrl(world)
})

When('I submit the explore search', async function () {
  const world = this
  let useAmp = false
  
  if ((world.queryKeyword) || (world.querySort) || (world.queryPage)) {
    world.resource += '?'
  }
  if (world.queryPage) {
    world.resource += world.queryPage
    useAmp = true
  }
  if (world.queryKeyword) {
    world.resource += useAmp ? '&' : ''
    world.resource += world.queryKeyword
    useAmp = true
  }
  if (world.querySort) {
    world.resource += useAmp ? '&' : ''
    world.resource += world.querySort
  }

  // Normally testing is against the mock search service, in which case the
  // delay for indexing is not necessary and should be set to 0. If testing against
  // a real elasticsearch server, then a sleep of around 1300 millis will allow
  // elasticsearch to index the new documents.
  //sleep(config.get('search.test_delay_for_indexing'))
  await getUrl(world)
})

Then('there should be {int} causes listed', function (noOfCauses) {
  const world = this
  const resultCount = (world.response.text.match(/data-cause-item=/g) || []).length
  expect(resultCount).to.equal(noOfCauses)
})

Then('the {string} option should be selected', function (sortType) {
  const world = this
  if (sortType === 'name-asc') {
    expect(world.response.text).to.include(`<option value="name-asc" selected="selected"`)
  } else if (sortType === 'name-desc') {
    expect(world.response.text).to.include(`<option value="name-desc" selected="selected"`)
  } else if (sortType === 'newest') {
    expect(world.response.text).to.include(`<option value="newest" selected="selected"`)
  } else {
    console.log('Unknown sort type specified in test. EXITING')
    process.exit(0)
  }
})

Then('the cause-search box should be populated with {string}', function (keyword) {
  const world = this
  expect(world.$('#cause-search').val()).to.equal(keyword)
})

Then('the current page number should be {int}', function (currentPageNum) {
  const world = this
  expect(world.response.text).to.include(`data-cause-page="${currentPageNum}"`)
})

Then('the actual page number should be {int}', function (actualPageNum) {
  const world = this
  expect(world.response.text).to.include(`data-cause-page="${actualPageNum}"`)
})

Then('the total number of pages should be {int}', function (totalPageNum) {
  const world = this
  expect(world.response.text).to.include(`data-cause-total-pages="${totalPageNum}"`)
})

Then('the results per page should be {int}', function (resultsPerPage) {
  const world = this
  expect(world.response.text).to.include(`data-cause-rpp="${resultsPerPage}"`)
})

Then('the total number of results should be {int}', function (totalNoOfResults) {
  const world = this
  expect(world.response.text).to.include(`data-cause-total-results="${totalNoOfResults}"`)
})

Then('the number of results listed on the page should be {int}', function (noOfResultsOnPage) {
  const world = this
  expect(world.response.text).to.include(`data-cause-rtp="${noOfResultsOnPage}"`)
})

Then('the previous button should be {string}', function (buttonState) {
  const world = this
  if (buttonState === 'hidden') {
    expect(world.response.text).to.not.include('paginator-previous')
  } else {
    expect(world.response.text).to.include('paginator-previous')
  }
})

Then('the next button should be {string}', function (buttonState) {
  const world = this
  if (buttonState === 'hidden') {
    expect(world.response.text).to.not.include('paginator-next')
  } else {
    expect(world.response.text).to.include('paginator-next')
  }
})

Then('the expected causes displayed are {string}', function (causesDisplayed) {
  const world = this
  if (causesDisplayed === '') {
    return
  }

  const expectedIds = causesDisplayed.split(',')
  const causes = world.$('#explore-results').find('*[data-cause-item]')

  expect(expectedIds.length).to.equal(causes.length)
  for (let i = 0; i < expectedIds.length; i++) {
    expect(expectedIds[i]).to.equal(world.$(causes[i]).attr('data-cause-item'))
  }
})
