'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('validate.js')
const constraints = require('../../forms/constraints/post-register')

let registerForm = null
const firstNameId = '#first_name'
const lastNameId = '#last_name'
const userEmailId = '#user_email'
const registerFormName = `form[name='register']`
const registerSubmitId = '#register-submit'
const successDivId = '#register-success-notice'
const errorDivId = '#register-error-notice'

const handleSubmitFailure = (jqXHR, textStatus, errorThrown) => {
  handlers.handleErrorEvent(jqXHR.responseJSON, errorDivId, registerSubmitId)
  grecaptcha.reset()
}

const handleSubmitSuccess = (data, textStatus, jqXHR) => {
  registerForm.trigger('reset')
  registerForm.addClass('d-none')
  $('h2').text(data.routeTitle)

  $(successDivId).removeClass('d-none')
  $(successDivId).text(data.message)
}

const handleRegister = () => {
  registerForm = $(registerFormName)
  registerForm.submit((e) => e.preventDefault())

  $(registerSubmitId).on('click', () => {
    handlers.prepareDataForSubmission(firstNameId)
    handlers.prepareDataForSubmission(lastNameId)
    handlers.prepareDataForSubmission(userEmailId)

    const schema = handlers.handleBuildSchema(registerForm)
    const errors = validate(schema, constraints, { fullMessages: false })
    if (errors) {
      handlers.handleErrorEvent(errors, errorDivId, registerSubmitId)
      return
    }

    handlers.handleFormPreSubmit(errorDivId, registerSubmitId)
    $.ajax({
      type: "POST",
      url: registerForm.attr('action'),
      data: schema,
      statusCode: {
        200: handleSubmitSuccess,
        400: handleSubmitFailure,
        404: handleSubmitFailure,
        500: handleSubmitFailure
      }
    })
  })
}

module.exports = {
  handleRegister
}
