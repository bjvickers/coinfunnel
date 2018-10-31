'use strict'

const expect = require('chai').expect
const { Then } = require('cucumber')

Then('I should receive a {int} http status code', function (status) {
  const world = this
  expect(world.response.status).to.equal(status)
})
