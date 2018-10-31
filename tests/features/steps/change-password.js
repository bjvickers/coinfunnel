'use strict'

const expect = require('chai').expect
const { Given, When, Then } = require('cucumber')
const { inject } = require('./before-all')
const { postUrl } = require('../support/network')
const { createValidPassword, createInvalidPassword } = require('../support/password')
const { createValidChangePasswordSchema } = require('../support/change-password')

Given('I want to change my existing password', function () {
  const world = this
  world.resource = inject.ACL.PostChangePassword.resource
})

When('I submit a valid internal change password request', async function () {
  const world = this
  await postUrl(world, createValidChangePasswordSchema())
})

When('I submit an {string} internal change password request', async function (typeOfInvalidity) {
  const world = this
  const schema = inject.PostChangePasswordSchema
  schema.current_password = createValidPassword(1)
  schema.new_password = createInvalidPassword(typeOfInvalidity)
  schema.confirm_new_password = createInvalidPassword(typeOfInvalidity)
  await postUrl(this, schema)
})

When('I submit an internal change password request with non-matching new passwords', async function () {
  const world = this
  const schema = createValidChangePasswordSchema()
  schema.confirm_new_password = createValidPassword(3)
  await postUrl(this, schema)
})

When('I submit a valid internal change password request with an incorrect current password', async function () {
  const world = this
  const schema = createValidChangePasswordSchema()
  schema.current_password = 'wrongpassword'
  await postUrl(this, schema)
})

Then('I should receive an invalid password notice', function () {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.new_password[0]).to.equal('New password should be between 10 and 60 characters long')
})

Then('I should receive a non-matching passwords notice', function () {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.confirm_new_password[0]).to.equal('"New password" does not match "Confirm new password"')
})

Then('I should receive a current-password {string} notice', function (message) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json).to.equal(message)
})
