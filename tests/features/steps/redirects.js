'use strict'

const expect = require('chai').expect
const { Then } = require('cucumber')

Then('I should be redirected to the {string} page', function (dashboard) {
  const world = this
  expect(world.response.text).to.equal(`Found. Redirecting to ${dashboard}`)
})
