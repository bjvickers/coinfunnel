'use strict'

const expect = require('chai').expect
const { Then } = require('cucumber')
const { inject } = require('./before-all')

Then('I should see public links', function () {
  const world = this
  expect(world.response.text).to.include(`href="${inject.ACL.GetIndex.resource}"`)
  expect(world.response.text).to.include(`href="${inject.ACL.GetExplore.resource}"`)
})

Then('I should {string} access links', function (accessLinks) {
  const world = this
  const loginLink = inject.seoLibrary.getLinkTitle(inject.ACL.GetLogin.resource)
  const registerLink = inject.seoLibrary.getLinkTitle(inject.ACL.GetRegister.resource)

  if (accessLinks === 'see') {
    expect(world.response.text).to.include(`<a class="nav-link" href="${inject.ACL.GetLogin.resource}">${loginLink}</a>`)
    expect(world.response.text).to.include(`<a class="nav-link" href="${inject.ACL.GetRegister.resource}">${registerLink}</a>`)
  } else {
    expect(world.response.text).to.not.include(`<a class="nav-link" href="${inject.ACL.GetLogin.resource}">${loginLink}</a>`)
    expect(world.response.text).to.not.include(`<a class="nav-link" href="${inject.ACL.GetRegister.resource}">${registerLink}</a>`)
  }
})

Then('I should {string} private links', function (privateLinks) {
  const world = this
  const logoutLink = inject.seoLibrary.getLinkTitle(inject.ACL.GetLogout.resource)

  let dashboardUrl = null
  if (world.user.role === inject.UserRoles.cause) {
    dashboardUrl = inject.ACL.GetCauseIndex.resource
  } else if (world.user.role === inject.UserRoles.donator) {
    dashboardUrl = inject.ACL.GetDonatorIndex.resource
  } else if (world.user.role === inject.UserRoles.admin) {
    dashboardUrl = inject.ACL.GetAdminIndex.resource
  }

  if (privateLinks === 'see') {
    expect(world.response.text).to.include(`href="${dashboardUrl}"`)
    expect(world.response.text).to.include(`href="#">${logoutLink}</a>`)
  } else {
    expect(world.response.text).to.not.include(`href="${dashboardUrl}"`)
    expect(world.response.text).to.not.include(`href="#">${logoutLink}</a>`)
  }
})
