'use strict'

const $ = require('jquery')
const handlers = require('./handlers')

const resource = '/user/notice/'
const oldNotice = '.old-notice'
const newNotice = '.new-notice'
const noticeDisplay = '#notice-display'
const deleteNotice = '.delete-notice'

const handleIgnore = (data, textStatus, jqXHR) => {}

const handleRefresh = (data, textStatus, jqXHR) => {
  window.location.replace(data)
}

const buildEndpoint = (element) => {
  const noticeId = $(element).data('notice-id')
  return resource + noticeId
}

const triggerRequest = (method, elementOrigin, handleSuccess) => {
  $.ajax({
    type: method,
    url: buildEndpoint(elementOrigin),
    statusCode: {
      200: handleSuccess,
      400: handleIgnore,
      403: handleIgnore,
      404: handleIgnore,
      500: handleIgnore
    }
  })
}

const removeNewNoticeBehaviour = (element) => {
  $(element).removeClass('new-notice')
  $(element).removeClass('font-weight-bold')
  $(element).off('click')
}

const addOldNoticeBehaviour = (element) => {
  $(element).addClass('old-notice')
  $(element).on('click', function (event) {
    event.preventDefault()
    displayNotice(this)
  })
}

const decrementReadCount = () => {
  let unreadNoticeCount = Number($('#unread-notice-count').data('unread-notices-count'))
  $('#unread-notice-count').data('unread-notices-count', --unreadNoticeCount)

  if (unreadNoticeCount <= 0) {
    unreadNoticeCount = ''
  }

  $('.unread-notice-count').each(function (index, element) {
    $(element).text(unreadNoticeCount)
  })

  if (unreadNoticeCount === '') {
    $('.unread-notice-count').each(function (index, element) {
      $(element).addClass('d-none')
    })
  }
}

const displayNotice = (element) => {
  const contentId = $(element).attr('href')
  const content = $(contentId).html()
  $(noticeDisplay).html(content)
  $(noticeDisplay).removeClass('d-none')
}

const handleNotices = () => {
  $(newNotice).on('click', function (event) {
    event.preventDefault()
    triggerRequest('GET', this, handleIgnore)
    removeNewNoticeBehaviour(this)
    addOldNoticeBehaviour(this)
    decrementReadCount()
    displayNotice(this)
  })

  $(oldNotice).on('click', function (event) {
    event.preventDefault()
    displayNotice(this)
  })

  $(deleteNotice).on('click', function (event) {
    event.preventDefault()
    triggerRequest('DELETE', this, handleRefresh)
  })
}

module.exports = {
  handleNotices
}
