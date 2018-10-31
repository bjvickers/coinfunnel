'use strict'

const config = require('config')
const expect = require('chai').expect
const { Given, When, Then } = require('cucumber')
const { inject } = require('./before-all')
const { getUrl, postUrl } = require('../support/network')
const { createPostWalletSchema } = require('../support/wallet')

Given('there are {int} volunteer miners for my charity', async function (noOfVolunteerMiners) {
  const world = this
  world.resource = inject.ACL.PostCauseActionAPIV1.resource
  world.causeToMineID = world.dbCause.externalId

  let payload = null
  for (let i = 1; i <= noOfVolunteerMiners; i++) {
    payload = {
      clientId: i,
      externalCauseId: world.causeToMineID,
      action: 'add'
    }
    await postUrl(world, payload)
  }
})

// @todo
// Cannot implement test until tests can be executed at a higher level of abstraction
Given('there is a historic total of {int} unique volunteer miners across all charities', async function (noOfVolunteerMiners) {
  const world = this

  // loop
    // await createCauseAccount
    // await popupulateCause
    // await toggleCauseOnline
    // add causeId to list of causes to mine against
  
  // loop
    // for each unique volunteer hit the endpoint against one of the causes randomly
})

Given('I have a miner client', function () {
  const world = this
  world.clientID = 1
})

// @todo replace with the process of creating a cause formally.
Given('I have a cause to mine against', async function () {
  const world = this
  world.dbCause = inject.CauseFactory.create()
  world.dbCause.userId = 1
  world.dbCause.setExternalId(config.get('app.public_dns_domain'))
  world.dbCause.isOnline = true
  world.dbCause.name = 'Test Charity Ltd'
  world.dbCause.path = inject.CausePathFactory.createFromName(world.dbCause.name)
  world.dbCause.country = 'United Kingdom'
  world.dbCause.addKeywords(['test'])
  world.dbCause.dateAdded = new Date()
  world.dbCause.dateModified = new Date()
  world.dbCause = await inject.dbService.getCauseDataMapper().persist(world.dbCause)
  world.causeToMineID = world.dbCause.externalId

  const address = createPostWalletSchema(world).wallet_address
  const wallet = inject.walletLibrary.createInitialWallet(world.dbCause.userId, new inject.Monero(), address)
  await inject.dbService.getWalletDataMapper().persist(wallet)
})

// @todo replace with the process of deleting an account formally.
Given('the cause has since been deleted', async function () {
  const world = this
  await inject.dbService.getCauseDataMapper().remove(world.dbCause)
  world.dbCause = null
})

// @todo replace with the process of toggling cause online status formally.
Given('the cause has since toggled offline {string} an offline notice', async function (withOrWithout) {
  const world = this
  world.dbCause.isOnline = false
  if (withOrWithout === 'with') {
    world.dbCause.offlineNotice = 'Reasons for being offline here'
  }
  await inject.dbService.getCauseDataMapper().persist(world.dbCause)
})

When('I send an invalid cause ID to the client api endpoint', async function () {
  const world = this
  world.resource = inject.ACL.GetAllAPIV1.resource
  world.resource += '/thisisinvalid/thisis<>invalid'
  await getUrl(world)
})

When('I send the cause ID to the client api endpoint', async function () {
  const world = this
  world.resource = inject.ACL.GetAllAPIV1.resource
  world.resource += `/${world.clientID}/${world.causeToMineID}`
  await getUrl(world)
})

Then('I should receive an {string} offline notice', function (message) {
  const world = this
  message = message || null
  const json = JSON.parse(world.response.text)
  expect(json).to.equal(message)
})

Then('I should receive {string} as the cause {string}', function (value, field) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json[field]).to.equal(value)
})
