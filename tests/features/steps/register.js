'use strict'

const expect = require('chai').expect
const { Given, When, Then } = require('cucumber')
const { webAppInstance, inject } = require('./before-all')
const { postUrl, getUrl } = require('../support/network')
const { createValidRegisterSchema, createInvalidRegisterName } = require('../support/register')

Given('I want to register', function () {
  const world = this
  world.resource = inject.ACL.PostRegister.resource
})

Given('I want to register as a {string} user', function (userRole) {
  const world = this
  if (!inject.userLibrary.isValidRole(userRole)) {
    console.log('Invalid UserRole in test. EXITING.')
    process.exit(0)
  }
  world.registerAsUserType = userRole
})

Given('I want to view the register page', function () {
  const world = this
  world.resource = inject.ACL.GetRegister.resource
})

When('I view the register page', async function () {
  const world = this
  await getUrl(world)
})

When('I submit an {string} name with a valid last name', async function (typeOfInvalidity) {
  const schema = createValidRegisterSchema()
  schema.first_name = createInvalidRegisterName(typeOfInvalidity)
  await postUrl(this, schema)
})

When('I submit a valid first name with an {string} name', async function (typeOfInvalidity) {
  const schema = createValidRegisterSchema()
  schema.last_name = createInvalidRegisterName(typeOfInvalidity)
  await postUrl(this, schema)
})

When('I submit an {string} name and an {string} name', async function (typeOfInvalidFirstName, typeOfInvalidLastName) {
  const schema = createValidRegisterSchema()
  schema.first_name = createInvalidRegisterName(typeOfInvalidFirstName)
  schema.last_name = createInvalidRegisterName(typeOfInvalidLastName)
  await postUrl(this, schema)
})

When('I submit non-matching email addresses', async function () {
  const schema = createValidRegisterSchema()
  schema.confirm_user_email = 'other@test.com'
  await postUrl(this, schema)
})

When('I submit non-matching passwords', async function () {
  const schema = createValidRegisterSchema()
  schema.confirm_user_password = 'abcdefgh'
  await postUrl(this, schema)
})

When('I submit non-matching email addresses and non-matching passwords', async function () {
  const schema = createValidRegisterSchema()
  schema.confirm_user_email = 'other@test.com'
  schema.confirm_user_password = 'abcdefgh'
  await postUrl(this, schema)
})

When('I submit recognised credentials to the register endpoint', async function () {
  const world = this
  const schema = createValidRegisterSchema()
  schema.user_email = world.dbUser.email
  schema.confirm_user_email = world.dbUser.email
  schema.user_password = world.dbUser.password.clearPassword
  schema.confirm_user_password = world.dbUser.password.clearPassword
  await postUrl(this, schema)
})

When('I submit valid credentials to the register endpoint', async function () {
  const world = this
  const schema = createValidRegisterSchema()
  schema.user_role = world.registerAsUserType || schema.user_role
  await postUrl(this, schema)
})

Then('I should receive a first name {string} notice', function (invalidNotice) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.first_name[0]).to.equal(invalidNotice)
})

Then('I should receive a last name {string} notice', function (invalidNotice) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.last_name[0]).to.equal(invalidNotice)
})

Then('I should receive an {string} email notice', function (invalidNotice) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.confirm_user_email[0]).to.equal(invalidNotice)
})

Then('I should receive an {string} password notice', function (invalidNotice) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.confirm_user_password[0]).to.equal(invalidNotice)
})

Then('I should receive a user role {string} notice', function (invalidNotice) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.user_role[0]).to.equal(invalidNotice)
})
