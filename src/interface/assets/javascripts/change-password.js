'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('validate.js')
const constraints = require('../../forms/constraints/post-change-password')

let form = null
const formName = `form[name='change-password']`
const currentPassId = '#current_password'
const newPassId = '#new_password'
const confNewPassId = '#confirm_new_password'
const submitId = '#change-password'
const cancelId = '#cancel-change-password'
const successDivId = '#change-password-success-notices'
const errorDivId = '#change-password-error-notices'
const successBadgeId = '#change-password-saved'

const handleSubmitSuccess = (data, textStatus, jqXHR) => {
  $(successBadgeId).removeClass('d-none')
  window.location.replace(data)
}

const handleSubmitFailure = (jqXHR, textStatus, errorThrown) => {
  handlers.handleErrorEvent(jqXHR.responseJSON, errorDivId, submitId)
  $(cancelId).prop("disabled", false)
}

const handleChangePassword = () => {
  form = $(formName)
  form.submit((e) => e.preventDefault())

  $(cancelId).on('click', () => {
    $(errorDivId).text("")
    $(errorDivId).addClass('d-none')
    form.trigger('reset')
  })

  $(submitId).on('click', () => {
    const schema = handlers.handleBuildSchema(form)
    const errors = validate(schema, constraints, { fullMessages: false })
    if (errors) {
      handlers.handleErrorEvent(errors, errorDivId, submitId)
      return
    }

    handlers.handleFormPreSubmit(errorDivId, submitId)
    $(cancelId).prop("disabled", true)

    $.ajax({
      type: "POST",
      url: form.attr('action'),
      data: schema,
      statusCode: {
        200: handleSubmitSuccess,
        400: handleSubmitFailure,
        401: handleSubmitFailure,
        403: handleSubmitFailure,
        500: handleSubmitFailure
      }
    })
  })
}

module.exports = {
  handleChangePassword
}
