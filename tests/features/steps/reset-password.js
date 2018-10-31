'use strict'

const expect = require('chai').expect
const { Given, When, Then } = require('cucumber')
const { inject } = require('./before-all')
const { getUrl, postUrl } = require('../support/network')
const { createValidEmail, createInvalidEmail } = require('../support/email')

Given('I want to reset my password', function () {
  const world = this
  world.resource = inject.ACL.PostResetPassword.resource
})

Given('I want to view the reset-password page', function () {
  const world = this
  world.resource = inject.ACL.GetResetPassword.resource
})

When('I view the reset-password page', async function () {
  const world = this
  await getUrl(world)
})

When('I submit an {string} email address on the reset-password form', async function (typeOfInvalidity) {
  let schema = inject.PostResetPasswordSchema
  schema.user_email = createInvalidEmail(typeOfInvalidity)
  await postUrl(this, schema)
})

When('I submit valid and correct credentials on the reset-password form', async function () {
  const world = this
  let schema = inject.PostResetPasswordSchema
  schema.user_email = world.user.email || createValidEmail()
  await postUrl(this, schema)
})

Then('I should receive a {string} header update notice', function (invalidNotice) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.routeTitle).to.equal(invalidNotice)
})

Then('I should receive a {string} body update notice', function (invalidNotice) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.message).to.equal(invalidNotice)
})
