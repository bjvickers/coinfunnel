'use strict'

const expect = require('chai').expect
const { Given, When, Then } = require('cucumber')
const { inject } = require('./before-all')
const { postUrl } = require('../support/network')
const { createPostWalletSchema, createInvalidWalletAddress, insertPreviousWallets } = require('../support/wallet')

Given('I want to add a wallet', function () {
  const world = this
  world.resource = inject.ACL.PostWallet.resource
})

When('I submit a valid wallet', async function () {
  await postUrl(this, createPostWalletSchema(this))
})

When('I submit an {string} wallet address', async function (typeOfInvalidity) {
  const world = this
  const schema = createPostWalletSchema(world)
  schema.wallet_address = createInvalidWalletAddress(typeOfInvalidity)
  await postUrl(this, schema)
})

When('I submit an invalid wallet currency', async function () {
  const world = this
  const schema = createPostWalletSchema(world)
  schema.wallet_currency = 'this-is-an-invalid-currency'
  await postUrl(this, schema)
})

When('I submit an invalid wallet creator type', async function () {
  const world = this
  const schema = createPostWalletSchema(world)
  schema.wallet_creator_type = 'this-is-an-invalid-type'
  await postUrl(this, schema)
})

When('I have {int} previous wallets', async function (noOfPrevWallets) {
  const world = this
  await insertPreviousWallets(world, noOfPrevWallets)
})

Then('I should receive a wallet address {string} notice', function (message) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.wallet_address[0]).to.equal(message)
})

Then('I should receive a wallet currency {string} notice', function (message) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.wallet_currency[0]).to.equal(message)
})

Then('I should receive a wallet creator type {string} notice', function (message) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.wallet_creator_type[0]).to.equal(message)
})

Then('my current wallet shows the {string} currency', function (expectedCurrency) {
  const world = this
  const currency = world.$('#current-wallet-currency').text()
  expect(currency).to.include(expectedCurrency)
})

Then('my current wallet shows the {string} wallet address', function (expectedAddress) {
  const world = this
  const walletAddress = world.$('#current-wallet-addr').text()
  expect(walletAddress).to.equal(expectedAddress)
})

Then('my current wallet shows the {string} wallet creator type', function (expectedCreatorType) {
  const world = this
  const creatorType = world.$('#current-wallet-creator').text()
  expect(creatorType).to.equal(expectedCreatorType)
})

Then('my current wallet shows {string} as the current balance', function (expectedBalance) {
  const world = this
  const balance = world.$('#current-wallet-balance').text()
  expect(balance).to.include(expectedBalance)
})

Then('my current wallet shows {string} as the mining donations received', function (expectedAmtReceived) {
  const world = this
  const miningDonations = world.$('#current-wallet-donations').text()
  expect(miningDonations).to.equal(expectedAmtReceived)
})

Then('my {int} previous wallets are listed in the history section', async function (noOfPrevWallets) {
  const world = this

  const previousWallets = await inject.dbService.getWalletDataMapper().findPreviousByUserId(world.dbUser.id)
  for (let i = 0; i < noOfPrevWallets; i++) {
    expect(world.$(`#prev-wallet-currency${i}`).html()).to.include(previousWallets[i].currency.getCurrency())
    expect(world.$(`#prev-wallet-addr${i}`).html()).to.equal(previousWallets[i].address)
    expect(world.$(`#prev-wallet-creator${i}`).html()).to.equal(previousWallets[i].creatorType)
    expect(world.$(`#prev-wallet-donations${i}`).html()).to.include(previousWallets[i].miningDonations)
  }
})

Then('there are no previous wallets listed in the history section', async function () {
  const world = this
  expect(world.$('.no-previous-wallets').length).to.equal(1)
})
