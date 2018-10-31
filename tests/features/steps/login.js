'use strict'

const expect = require('chai').expect
const { Given, When, Then } = require('cucumber')
const { inject } = require('./before-all')
const { getUrl, postUrl } = require('../support/network')
const { createValidEmail, createInvalidEmail } = require('../support/email')
const { createValidPassword, createInvalidPassword } = require('../support/password')

Given('I want to log in', function () {
  const world = this
  world.resource = inject.ACL.PostLogin.resource
})

Given('I want to view the login page', function () {
  const world = this
  world.resource = inject.ACL.GetLogin.resource
})

When('I view the login page', async function () {
  const world = this
  await getUrl(world)
})

When('I submit recognised credentials', async function () {
  const world = this
  let schema = inject.PostLoginSchema
  schema.user_email = world.dbUser.email
  schema.user_password = world.dbUser.password.clearPassword
  await postUrl(this, schema)
})

When('I submit a valid email address with an incorrect password', async function () {
  const world = this
  let schema = inject.PostLoginSchema
  schema.user_email = world.dbUser.email
  schema.user_password = 'abcdefghAABC'
  await postUrl(this, schema)
})

When('I submit valid and correct credentials', async function () {
  let schema = inject.PostLoginSchema
  schema.user_email = createValidEmail()
  schema.user_password = createValidPassword(1)
  await postUrl(this, schema)
})

When('I submit an {string} email address with a valid password', async function (typeOfInvalidity) {
  let schema = inject.PostLoginSchema
  schema.user_email = createInvalidEmail(typeOfInvalidity)
  schema.user_password = createValidPassword(1)
  await postUrl(this, schema)
})

When('I submit a valid email address with an {string} password', async function (typeOfInvalidity) {
  let schema = inject.PostLoginSchema
  schema.user_email = createValidEmail()
  schema.user_password = createInvalidPassword(typeOfInvalidity)
  await postUrl(this, schema)
})

When('I submit an {string} email address and an {string} password', async function (typeOfEmailInvalidity, typeOfPasswordInvalidity) {
  let schema = inject.PostLoginSchema
  schema.user_email = createInvalidEmail(typeOfEmailInvalidity)
  schema.user_password = createInvalidPassword(typeOfPasswordInvalidity)
  await postUrl(this, schema)
})

Then('I should receive an email {string} notice', function (invalidNotice) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.user_email[0]).to.equal(invalidNotice)
})

Then('I should receive a password {string} notice', function (invalidNotice) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.user_password[0]).to.equal(invalidNotice)
})

Then('I should receive a {string} notice', function (invalidNotice) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json).to.equal(invalidNotice)
})

Then('I should receive an authentication token', function () {
  const world = this
  expect(world.response.header['set-cookie'].length).to.equal(1)
})

Then('I should be redirected to {string}', function (redirect) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json).to.equal(redirect)
})

Then('my fullname should be correctly displayed', function () {
  const world = this
  expect(world.$('#account-name').html()).to.equal('Random Lastname')
})

Then('my email should be correctly displayed', function () {
  const world = this
  expect(world.$('#account-email').html()).to.equal('test@test.com')
})

Then('my last-logged-in notice should state {string}', function (notice) {
  const world = this
  expect(world.$('#account-last-login').html()).to.contain(notice)
})
