'use strict'

const expect = require('chai').expect
const config = require('config')
const { Given, When } = require('cucumber')
const { inject } = require('./before-all')
const { postUrl } = require('../support/network')
const { sleep } = require('../support/sleep')

Given('I want to toggle cause online status', function () {
  const world = this
  world.resource = inject.ACL.PostCauseOnlineStatus.resource
})

Given('my charity online status is currently {string}', async function (onlineStatus) {
  const world = this

  // Update database
  const cause = await inject.dbService.getCauseDataMapper().findByUserId(world.dbUser.id)
  if (onlineStatus === 'online') {
    cause.isOnline = true
  } else {
    cause.isOnline = false
  }
  await inject.dbService.getCauseDataMapper().persist(cause)

  // Normally testing is against the mock search service, in which case the
  // delay for indexing is not necessary and should be set to 0. If testing against
  // a real elasticsearch server, then a sleep of around 1300 millis will allow
  // elasticsearch to index the new documents.
  //sleep(config.get('search.test_delay_for_indexing'))
})

When('I submit the toggle online status request', async function () {
  const world = this
  await postUrl(world, null)
})
