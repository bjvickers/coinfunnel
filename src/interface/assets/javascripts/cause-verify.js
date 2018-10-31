'use strict'

const $ = require('jquery')
const handlers = require('./handlers')

const fallback = '/dashboard/cause'
const resource = '/dashboard/cause/verify'
const requestVerifyCheck = '#verificationCheck'
const submitId = '#submit-verify'
const errorDivId = '#cause-verify-error'
const successBadgeId = '#cause-verify-sent'

const handleSuccess = (data, textStatus, jqXHR) => {
  $(successBadgeId).removeClass('d-none')
  window.location.replace(data)
}

const handleFailure = (jqXHR, textStatus, errorThrown) => {
  handlers.handleErrorEvent(jqXHR.responseJSON, errorDivId, submitId)
}

const handleVerify = () => {

  $(requestVerifyCheck).on('change', function () {
    if ($(this)[0].checked) {
      $(submitId).prop('disabled', false)
    } else {
      $(submitId).prop('disabled', true)
    }
  })

  $(submitId).on('click', () => {
    $(submitId).prop('disabled', true)
    $.ajax({
      type: 'POST',
      url: resource,
      statusCode: {
        200: handleSuccess,
        400: handleFailure,
        403: handleFailure,
        500: handleFailure
      }
    })
  })
}

module.exports = {
  handleVerify
}
