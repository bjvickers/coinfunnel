'use strict'

const { Given, When, Then } = require('cucumber')
const { inject } = require('./before-all')
const { getUrl, postUrl } = require('../support/network')
const { createValidPassword, createInvalidPassword } = require('../support/password')

Given('I want to submit my new password', function () {
  const world = this
  world.resource = inject.ACL.PostResetPasswordConfirm.resource + '?token=' + world.token.token
})

Given('I want to view the reset-password-confirm page', function () {
  const world = this
  const query = (world.token) ? world.token.token : null
  world.resource = inject.ACL.GetResetPasswordConfirm.resource + '?token=' + query
})

When('I view the reset-password-confirm page', async function () {
  const world = this
  await getUrl(world)
})

When('I submit the reset-password-confirm form with an {string} password', async function (typeOfInvalidity) {
  const world = this
  let schema = inject.PostResetPasswordConfirmSchema
  schema.user_password = createInvalidPassword(typeOfInvalidity)
  schema.confirm_user_password = createInvalidPassword(typeOfInvalidity)
  await postUrl(this, schema)
})

When('I submit the reset-password-confirm form non-matching passwords', async function () {
  const world = this
  let schema = inject.PostResetPasswordConfirmSchema
  schema.user_password = createValidPassword(1)
  schema.confirm_user_password = createValidPassword(1) + 'abcdefg'
  await postUrl(this, schema)
})

When('I submit the reset-password-confirm form with valid passwords', async function () {
  const world = this
  let schema = inject.PostResetPasswordConfirmSchema
  schema.user_password = createValidPassword(2)
  schema.confirm_user_password = createValidPassword(2)
  await postUrl(this, schema)
})

Then('the old password should no longer work', async function () {
  const world = this
  world.resource = inject.ACL.PostLogin.resource
  
  // Repost to the server using the initial password on account
  // creation. This should no longer work.
  let schema = inject.PostLoginSchema
  schema.user_email = world.dbUser.email
  schema.user_password = createValidPassword(1)
  await postUrl(this, schema)
})

Then('the new password should work', async function () {
  const world = this
  world.resource = inject.ACL.PostLogin.resource
  
  // Repost to the server, this time using the new password that was
  // submitted in the password-reset
  let schema = inject.PostLoginSchema
  schema.user_email = world.dbUser.email
  schema.user_password = createValidPassword(2)
  await postUrl(this, schema)
})
