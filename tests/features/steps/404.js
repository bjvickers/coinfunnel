'use strict'

const expect = require('chai').expect
const { Given, When, Then } = require('cucumber')
const { inject } = require('./before-all')
const { getUrl } = require('../support/network')

Given('I want to view the "does-not-exist" page', function () {
  const world = this
  world.resource = inject.ACL.Get404.resource
})

When('I view the "does-not-exist" page', async function () {
  const world = this
  await getUrl(world)
})

Then('I should receive a 404 error page', function () {
  const world = this
  const notFoundRouteTitle = inject.seoLibrary.getRouteTitle(inject.ACL.Get404.resource)
  expect(world.$('h2').text()).to.equal(notFoundRouteTitle)
})
