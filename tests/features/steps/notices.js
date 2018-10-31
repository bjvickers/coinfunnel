'use strict'

const expect = require('chai').expect
const { When, Then } = require('cucumber')
const { inject } = require('./before-all')
const { getUrl, deleteUrl } = require('../support/network')
const { buildNotice } = require('../support/notices')

When('there are {int} system notices released prior to my registration that are not applicable to me', async function (noOfNotApplicables) {
  const world = this
  let noticePos = world.notices.length
  for (let i = 0; i < noOfNotApplicables; i++) {
    const notice = buildNotice(++noticePos, new Date(Date.now() - 86400))
    await inject.dbService.getNoticeDataMapper().persist(notice)
    world.notices.push(notice)
  }
})

When('there are {int} system notices released prior to my registration that are applicable to me', async function (noOfApplicables) {
  const world = this
  let noticePos = world.notices.length
  for (let i = 0; i < noOfApplicables; i++) {
    const notice = buildNotice(++noticePos, new Date(Date.now() + 86400))
    await inject.dbService.getNoticeDataMapper().persist(notice)
    world.notices.push(notice)
  }
})

When('{int} notices are added to the system', async function (noOfNotices) {
  const world = this
  let noticePos = world.notices.length
  for (let i = 0; i < noOfNotices; i++) {
    const notice = buildNotice(++noticePos, null)
    await inject.dbService.getNoticeDataMapper().persist(notice)
    world.notices.push(notice)
  }
})

When("I have 1 'unread' notice", async function () {
  const world = this
  let noticePos = world.notices.length
  const notice = buildNotice(++noticePos, null)
  await inject.dbService.getNoticeDataMapper().persist(notice)
  world.notices.push(notice)
})

When("I trigger the read notice link", async function () {
  const world = this
  world.resource = inject.ACL.GetNotice.resource
  world.resource += '/' + world.notices[0].id
  await getUrl(world)
})

When("I trigger the delete notice link", async function () {
  const world = this
  world.resource = inject.ACL.DeleteNotice.resource
  world.resource += '/' + world.notices[0].id
  await deleteUrl(world, null)
})

Then('the new-notice-badge should show {int} unread messages', function (noOfUnread) {
  const world = this
  expect(world.$('#unread-notice-count').data('unread-notices-count')).to.equal(noOfUnread)
})

Then('I should see the correct notice information', function () {
  const world = this
  for (let i = 0; i < world.notices.length; i++) {
    const noticeId = world.notices[i].id
    const subject = world.notices[i].subject
    const content = world.notices[i].content

    let actualContent = world.$('.notice-subject').filter(`[data-notice-id="${noticeId}"]`)
    expect(actualContent.text()).to.equal(subject)

    actualContent = world.$(`#notice-collapse-${noticeId}`)
    expect(actualContent.text()).to.equal(content)
  }
})

Then('there should be {int} notices listed', function (noOfNotices) {
  const world = this
  const actualNoOfNotices = world.$('#unread-notice-count').data('unread-notices-count')
  expect(actualNoOfNotices).to.equal(noOfNotices)
})
