'use strict'

const expect = require('chai').expect
const { Given, When, Then } = require('cucumber')
const { inject } = require('./before-all')
const { getUrl } = require('../support/network')

Given('I want to view the cause-dashboard page', function () {
  const world = this
  world.resource = inject.ACL.GetCauseIndex.resource
})

When('I view the cause-dashboard page', async function () {
  const world = this
  await getUrl(world)
})

Then('my cause state list should show {string} as {string}', function (item, state) {
  const world = this
  
  if (item === 'details') {
    const causeStateId = 'cause-details-state'
    expect(world.$(`#${causeStateId}`).data('value')).to.equal(state)
  } else if (item === 'online-status') {
    expect(world.response.text).to.include(`data-cause-visibility="${state}"`)
  } else {
    console.log('Unknown cause state list item in test. EXITING.')
    process.exit(0)
  }
})

Then('{int} should be displayed as the miner count for my charity', function (count) {
  const world = this
  expect(world.$('#no-of-cause-miners').text()).to.equal(count+'')
})
