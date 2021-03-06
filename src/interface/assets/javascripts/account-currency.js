'use strict'

const $ = require('jquery')
const handlers = require('./handlers')

const formName = `form[name='account-currency-frm']`
const fieldId = '#account_currency'
const editId = '#account-currency-edit'
const submitId = '#account-currency-submit'
const cancelId = '#account-currency-cancel'
const successBadgeId = '#account-currency-saved'
const errorDivId = '#account-currency-error'

const handleSuccess = (data, textStatus, jqXHR) => {
  $(editId).removeClass('d-none')
  $(submitId).addClass('d-none')
  $(cancelId).addClass('d-none')
  $(errorDivId).text('')
  $(errorDivId).addClass('d-none')
  $(submitId).prop('disabled', false)
  $(cancelId).prop('disabled', false)
  resetLS()
  $(successBadgeId).removeClass('d-none')
  window.location.replace(data)
}

const handleSubmitFailure = (jqXHR, textStatus, errorThrown) => {
  handlers.handleErrorEvent(jqXHR.responseJSON, errorDivId, submitId)
  $(cancelId).prop('disabled', false)
}

const setDisabledFields = (isDisabled) => {
  $(fieldId).prop('disabled', isDisabled)
}

const setFieldValuesFromLS = () => {
  if (window.localStorage.getItem(fieldId) !== null) {
    $(fieldId).val(window.localStorage.getItem(fieldId))
  }
}

const resetLS = () => {
  window.localStorage.removeItem(fieldId)
}

const buildSchema = () => {
  const schema = {}
  schema[fieldId.substr(1)] = $(fieldId).val()
  return schema
}

const handleUpdate = () => {
  const form = $(formName)
  form.submit((e) => e.preventDefault())

  setDisabledFields(true)
  setFieldValuesFromLS()
  resetLS()

  $(editId).on('click', () => {
    setDisabledFields(false)
    $(editId).addClass('d-none')
    $(submitId).removeClass('d-none')
    $(cancelId).removeClass('d-none')
    window.localStorage.setItem(fieldId, $(fieldId).val())
  })

  $(cancelId).on('click', () => {
    setDisabledFields(true)
    $(editId).removeClass('d-none')
    $(submitId).addClass('d-none')
    $(cancelId).addClass('d-none')
    $(errorDivId).text('')
    $(errorDivId).addClass('d-none')
    setFieldValuesFromLS()
    resetLS()
  })

  $(submitId).on('click', () => {
    const schema = buildSchema()
    handlers.handleFormPreSubmit(errorDivId, submitId)
    $(cancelId).prop('disabled', true)
    $.ajax({
      type: 'post',
      url: $(formName).attr('action'),
      data: schema,
      statusCode: {
        200: handleSuccess,
        400: handleSubmitFailure,
        403: handleSubmitFailure,
        500: handleSubmitFailure
      }
    })
  })
}

module.exports = {
  handleUpdate
}
