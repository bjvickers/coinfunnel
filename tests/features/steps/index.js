'use strict'

const expect = require('chai').expect
const { Given, When, Then } = require('cucumber')
const { inject } = require('./before-all')
const { getUrl } = require('../support/network')

Given('I want to view the index page', function () {
  const world = this
  world.resource = inject.ACL.GetIndex.resource
})

When('I view the index page', async function () {
  const world = this
  await getUrl(world)
})
