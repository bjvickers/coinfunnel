'use strict'

const expect = require('chai').expect
const { Given, When, Then } = require('cucumber')
const { inject } = require('./before-all')
const { deleteUrl } = require('../support/network')
const { insertPreviousWallets } = require('../support/wallet')
const { createValidPassword, createInvalidPassword } = require('../support/password')
const { createValidDeleteAccountSchema } = require('../support/delete-account')

Given('I want to delete my account', function () {
  const world = this
  world.resource = inject.ACL.DeleteAccount.resource
})

Given('I do not have a cause to {string}', function (action) {
  const world = this
})

Given('I {string} {int} previous wallets', async function (haveOrNot, noOfWallets) {
  const world = this
  if (haveOrNot === 'have') {
    await insertPreviousWallets(world, noOfWallets)
  }
})

When('I submit a {string} password to trigger account deletion', async function (typeOfInvalidity) {
  const world = this
  const schema = createValidDeleteAccountSchema()
  schema.user_password = createInvalidPassword(typeOfInvalidity)
  await deleteUrl(this, schema)
})

When('I submit a valid but incorrect password to trigger account deletion', async function () {
  const world = this
  const schema = createValidDeleteAccountSchema()
  schema.user_password = 'abcdefghiKLMNOP111'
  await deleteUrl(this, schema)
})

When('I submit a valid password to trigger account deletion', async function () {
  const world = this
  const schema = createValidDeleteAccountSchema()
  schema.user_password = createValidPassword(1)
  await deleteUrl(this, schema)
})

Then('all my personal and charity details should be deleted', async function () {
  const world = this

  const user = await inject.dbService.getUserDataMapper().find(world.dbUser)
  expect(user).to.equal(null)

  if (world.dbCause) {
    const cause = await inject.dbService.getCauseDataMapper().findById(world.dbCause.id)
    expect(cause).to.equal(null)
  }

  const currentWallet = await inject.dbService.getWalletDataMapper().findCurrentByUserId(world.dbUser.id)
  expect(currentWallet).to.equal(null)

  const previousWallets = await inject.dbService.getWalletDataMapper().findPreviousByUserId(world.dbUser.id)
  expect(previousWallets.length).to.equal(0)
})
