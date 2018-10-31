'use strict'

const $ = require('jquery')
const validate = require('validate.js')
const handlers = require('./handlers')
const constraints = require('../../forms/constraints/post-login')

let loginForm = null
const loginFormName = `form[name='login']`
const userEmailId = '#user_email'
const loginSubmitId = '#login-submit'
const errorDivId = '#login-error-notice'

const handleSubmitFailure = (jqXHR, textStatus, errorThrown) => {
  handlers.handleErrorEvent(jqXHR.responseJSON, errorDivId,loginSubmitId)
  grecaptcha.reset()
}

const handleLogin = () => {
  loginForm = $(loginFormName)
  loginForm.submit((e) => e.preventDefault())

  $(loginSubmitId).on('click', () => {
    handlers.prepareDataForSubmission(userEmailId)
    const schema = handlers.handleBuildSchema(loginForm)
    const errors = validate(schema, constraints, { fullMessages: false })
    if (errors) {
      handlers.handleErrorEvent(errors, errorDivId, loginSubmitId)
      return
    }

    handlers.handleFormPreSubmit(errorDivId, loginSubmitId)
    $.ajax({
      type: "POST",
      url: loginForm.attr('action'),
      data: schema,
      statusCode: {
        200: (data, textStatus, jqXHR) => window.location.replace(data),
        400: handleSubmitFailure,
        401: handleSubmitFailure,
        404: handleSubmitFailure
      }
    })
  })
}

module.exports = {
  handleLogin
}
