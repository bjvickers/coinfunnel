'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('validate.js')
const constraints = require('../../forms/constraints/post-reset-password-confirm')

let resetPasswordConfirmForm = null
const resetPasswordConfirmFormName = `form[name='reset-password-confirm']`
const resetSubmitId = '#reset-confirm-submit'
const successDivId = '#resetpc-success-notice'
const errorDivId = '#resetpc-error-notice'

const handleSubmitFailure = (jqXHR, textStatus, errorThrown) => {
  handlers.handleErrorEvent(jqXHR.responseJSON, errorDivId, resetSubmitId)
}

const handleSubmitSuccess = (data, textStatus, jqXHR) => {
  resetPasswordConfirmForm.trigger('reset')
  resetPasswordConfirmForm.addClass('d-none')
  $('h2').text(data.routeTitle)
  $(successDivId).removeClass('d-none')
  $(successDivId).text(data.message)
}

const handleResetPasswordConfirm = () => {
  resetPasswordConfirmForm = $(resetPasswordConfirmFormName)
  resetPasswordConfirmForm.submit((e) => e.preventDefault())

  $(resetSubmitId).on('click', () => {
    const schema = handlers.handleBuildSchema(resetPasswordConfirmForm)
    const errors = validate(schema, constraints, { fullMessages: false })
    if (errors) {
      handlers.handleErrorEvent(errors, errorDivId, resetSubmitId)
      return
    }

    handlers.handleFormPreSubmit(errorDivId, resetSubmitId)
    $.ajax({
      type: "POST",
      url: resetPasswordConfirmForm.attr('action'),
      data: schema,
      statusCode: {
        200: handleSubmitSuccess,
        400: handleSubmitFailure,
        401: handleSubmitFailure,
        404: handleSubmitFailure
      }
    })
  })
}

module.exports = {
  handleResetPasswordConfirm
}
