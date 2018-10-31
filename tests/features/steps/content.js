'use strict'

const expect = require('chai').expect
const { Then } = require('cucumber')

Then('I should see the {string} title', function (routeTitle) {
  const world = this
  expect(world.$('h2').text()).to.equal(routeTitle)
})
