'use strict'

const expect = require('chai').expect
const { When, Given, Then } = require('cucumber')
const { inject } = require('./before-all')
const { getUrl } = require('../support/network')

Given('I want to view the register-confirm page', function () {
  const world = this
  world.resource = inject.ACL.GetRegisterConfirm.resource + '?token=' + world.token.token
})

When('I view the register-confirm page', async function () {
  const world = this
  await getUrl(world)
})

Then('the page should indicate registration complete', function () {
  const world = this
  const registerConfirmRouteTitle = inject.seoLibrary.getRouteTitle(inject.ACL.GetRegisterConfirm.resource)
  expect(world.$('h2').text()).to.equal(registerConfirmRouteTitle)
})
