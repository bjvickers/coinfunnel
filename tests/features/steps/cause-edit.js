'use strict'

const expect = require('chai').expect
const config = require('config')
const { Given, When, Then } = require('cucumber')
const slug = require('slugg')
const { inject } = require('./before-all')
const { postUrl } = require('../support/network')
const { sleep } = require('../support/sleep')
const { createCauseUser } = require('../support/user')
const { createValidDuplicateName, createValidSchema, createInvalidCauseName, createInvalidCauseKeyword } = require('../support/cause')

Given("I want to edit the cause I represent", async function () {
  const world = this
  world.resource = inject.ACL.PostCause.resource
})

Given("{int} other Cause has the same path", async function (noOfCauses) {
  const world = this

  // Create a valid schema with but force the path to be the same as an
  // existing CausePath (which can occur in production due to the creation of
  // slugs from Cause names).
  for (let i = 0; i < noOfCauses; i++) {
    const schema = createValidSchema()
    schema.cause_name = createValidDuplicateName(i)
    
    const dupCausePath = inject.CauseFactory.createCauseFromSchema(schema, inject.PostCauseMapping)
    dupCausePath.userId = world.dbUser.id + (i + 1)
    dupCausePath.setExternalId(config.get('app.public_dns_domain'))
    await inject.dbService.getCauseDataMapper().persist(dupCausePath)
  }
})

Given('I submit an {string} cause name', async function (invalidNameType) {
  const world = this
  const schema = createValidSchema()
  schema.cause_name = createInvalidCauseName(invalidNameType)
  await postUrl(this, schema)
})

Given('I submit an {string} cause keyword', async function (invalidKeywordType) {
  const world = this
  const schema = createValidSchema()
  schema.keywords = createInvalidCauseKeyword(invalidKeywordType)
  await postUrl(this, schema)
})

Given('I submit entirely invalid cause details', async function () {
  const world = this
  const schema = createValidSchema()
  schema.cause_name = createInvalidCauseName('invalid')
  schema.keywords = createInvalidCauseKeyword('invalid')
  await postUrl(this, schema)
})

Given('I have completed my charity profile details', async function () {
  const world = this
  world.resource = inject.ACL.PostCause.resource
  await postUrl(world, createValidSchema())
})

When('I submit a duplicate cause name', async function () {
  const world = this
  const schema = createValidSchema()
  schema.cause_name = createInvalidCauseName('duplicate')

  // Insert another cause into the database with the same name.
  const newUser = createCauseUser(inject)
  newUser.email = 'updated@test.com'
  newUser.password.encryptedPassword = await inject.passwordLibrary.getEncPasswordFromClearPassword(newUser.password.clearPassword)
  newUser.merge(await inject.dbService.getUserDataMapper().persist(newUser))

  const duplicateNameSchema = createValidSchema()
  duplicateNameSchema.cause_name = schema.cause_name
  const duplicateNameCause = inject.CauseFactory.createCauseFromSchema(duplicateNameSchema, inject.PostCauseMapping)
  duplicateNameCause.userId = newUser.id
  await inject.dbService.getCauseDataMapper().persist(duplicateNameCause)

  await postUrl(this, schema)
})

When('I submit valid and complete cause details', async function () {
  const world = this
  const schema = createValidSchema()
  await postUrl(this, schema)
})

Then('I should receive a cause name {string} notice', function (message) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.cause_name[0]).to.equal(message)
})

Then('I should receive a cause keyword {string} notice', function (message) {
  const world = this
  const json = JSON.parse(world.response.text)
  expect(json.keywords[0]).to.equal(message)
})

Then('I should see my cause details populated in the cause details form', function () {
  const world = this

  expect(world.$('#cause_name').val()).to.equal(createValidSchema().cause_name)
  expect(world.$('#cause_country').val()).to.equal(createValidSchema().cause_country)

  let validKeywords = createValidSchema().keywords.toLowerCase()
  expect(world.$('#keywords').val()).to.equal(validKeywords)
})

Then('my cause path should have {string} appended to the slug', function (extension) {
  const world = this
  const expectedPath = `${inject.ACL.GetShowcase.resource}/${slug(createValidSchema().cause_name)}${extension}`
  expect(world.$('#view-showcase-link').attr('href')).to.equal(expectedPath)
})
