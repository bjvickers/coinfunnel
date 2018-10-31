'use strict'

const expect = require('chai').expect
const { Then } = require('cucumber')
const { inject } = require('./before-all')

Then('I should receive a 500 error page', function () {
  const world = this
  const errorRouteTitle = inject.seoLibrary.getRouteTitle(inject.ACL.Get500.resource)
  expect(world.$('h2').text()).to.equal(errorRouteTitle)
})
