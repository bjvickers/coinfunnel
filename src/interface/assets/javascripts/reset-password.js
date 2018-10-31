'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('validate.js')
const constraints = require('../../forms/constraints/post-reset-password')

let resetPasswordForm = null
const resetPasswordFormName = `form[name='reset-password']`
const userEmailId = '#user_email'
const resetSubmitId = '#reset-submit'
const successDivId = '#resetp-success-notice'
const errorDivId = '#resetp-error-notice'

const handleSubmitFailure = (jqXHR, textStatus, errorThrown) => {
  handlers.handleErrorEvent(jqXHR.responseJSON, errorDivId, resetSubmitId)
  grecaptcha.reset()
}

const handleSubmitSuccess = (data, textStatus, jqXHR) => {
  resetPasswordForm.trigger('reset')
  resetPasswordForm.addClass('d-none')
  $('h2').text(data.routeTitle)
  $(successDivId).removeClass('d-none')
  $(successDivId).text(data.message)
}

const handleResetPassword = () => {
  resetPasswordForm = $(resetPasswordFormName)
  resetPasswordForm.submit((e) => e.preventDefault())

  $(resetSubmitId).on('click', () => {
    handlers.prepareDataForSubmission(userEmailId)
    const schema = handlers.handleBuildSchema(resetPasswordForm)
    const errors = validate(schema, constraints, { fullMessages: false })
    if (errors) {
      handlers.handleErrorEvent(errors, errorDivId, resetSubmitId)
      return
    }

    handlers.handleFormPreSubmit(errorDivId, resetSubmitId)
    $.ajax({
      type: "POST",
      url: resetPasswordForm.attr('action'),
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
  handleResetPassword
}
