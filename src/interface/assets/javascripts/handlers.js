'use strict'

const $ = require('jquery')
const Cookies = require('js-cookie')

const logoutId = '#logout'

const handleErrorEvent = (message, errorDivId, submitId) => {
  let output = ''
  if (typeof message === 'string') {
    output = message
  } else {
    let appendBreak = false
    for (let property in message) {
      if (message.hasOwnProperty(property)) {
        const individualMessages = String(message[property]).split(',')
        individualMessages.forEach((individualMessage) => {
          output = appendBreak ? output += '<br>' : output
          output += individualMessage
          appendBreak = true
        })
      }
    }
  }
  
  $(errorDivId).html(output)
  $(errorDivId).removeClass("d-none")
  $(submitId).prop("disabled", false)
}

const prepareDataForSubmission = (fieldId) => {
  const text = $(fieldId).val()
  $(fieldId).val($.trim(text))
}

const handleFormPreSubmit = (errorDivId, submitId) => {
  $(errorDivId).text("")
  $(errorDivId).addClass("d-none")
  $(submitId).prop("disabled", true)
}

const handleBuildSchema = (form) => {
  const schema = {}
  const schemaProperties = form.serializeArray()
  $.each( schemaProperties, ( i, schemaProperty ) => {
    schema[schemaProperty.name] = schemaProperty.value
  })
  return schema
}

const handleLogout = () => {
  $(logoutId).on("click", () => {
    Cookies.remove('token', { path: '/' })
    window.location.replace("/")
  })
}

module.exports = {
  prepareDataForSubmission,
  handleErrorEvent,
  handleFormPreSubmit,
  handleBuildSchema,
  handleLogout
}
