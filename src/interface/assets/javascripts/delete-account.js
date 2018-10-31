'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('validate.js')
const constraints = require('../../forms/constraints/delete-account')

let form = null
const formName = `form[name='account-delete-form']`
const fieldId = '#user_password'
const submitId = '#account-delete'
const cancelId = '#cancel-account-delete'
const errorDivId = '#account-delete-error-notices'

const handleSubmitFailure = (jqXHR, textStatus, errorThrown) => {
  handlers.handleErrorEvent(jqXHR.responseJSON, errorDivId, submitId)
  $(cancelId).prop("disabled", false)
}

const handleAccountDelete = () => {
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
      type: "delete",
      url: form.attr('action'),
      data: schema,
      statusCode: {
        200: (data, textStatus, jqXHR) => window.location.replace(data),
        400: handleSubmitFailure,
        401: handleSubmitFailure,
        403: handleSubmitFailure,
        500: handleSubmitFailure
      }
    })
  })
}

module.exports = {
  handleAccountDelete
}
