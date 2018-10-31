'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('validate.js')
const constraints = require('../../forms/constraints/post-wallet')

let form = null
const fieldId = '#wallet_address'
const formName = `form[name='wallet']`
const submitId = '#wallet-submit'
const cancelId = '#cancel-wallet-submit'
const successDivId = '#wallet-success-notices'
const errorDivId = '#wallet-error-notices'

const handleSubmitFailure = (jqXHR, textStatus, errorThrown) => {
  handlers.handleErrorEvent(jqXHR.responseJSON, errorDivId, submitId)
  $(cancelId).prop("disabled", false)
}

const handleWalletAdd = () => {
  form = $(formName)
  form.submit((e) => e.preventDefault())

  $(cancelId).on('click', () => {
    $(errorDivId).text("")
    $(errorDivId).addClass('d-none')
    form.trigger('reset')
  })

  $(submitId).on('click', () => {
    handlers.prepareDataForSubmission(fieldId)
    const schema = handlers.handleBuildSchema(form)
    const errors = validate(schema, constraints, { fullMessages: false })
    if (errors) {
      handlers.handleErrorEvent(errors, errorDivId, submitId)
      return
    }

    handlers.handleFormPreSubmit(errorDivId, submitId)
    $(cancelId).prop("disabled", true)

    $.ajax({
      type: "post",
      url: form.attr('action'),
      data: schema,
      statusCode: {
        200: (data, textStatus, jqXHR) => window.location.replace(data),
        400: handleSubmitFailure,
        403: handleSubmitFailure,
        500: handleSubmitFailure
      }
    })
  })
}

module.exports = {
  handleWalletAdd
}
