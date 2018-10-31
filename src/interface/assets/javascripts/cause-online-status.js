'use strict'

const $ = require('jquery')
const handlers = require('./handlers')

const fallback = '/dashboard/cause'
const resource = '/dashboard/cause/online-status'
const toggleOnlineStatus = 'input:radio[name=toggle-online-status]'

const handleToggleFailure = () => {
  window.location.replace(fallback)
}

const handleToggleOnlineStatus = () => {
  $(toggleOnlineStatus).on('click', () => {
    $.ajax({
      type: 'POST',
      url: resource,
      statusCode: {
        200: (data, textStatus, jqXHR) => window.location.replace(data),
        403: handleToggleFailure,
        404: handleToggleFailure,
        500: handleToggleFailure
      }
    })
  })
}

module.exports = {
  handleToggleOnlineStatus
}
