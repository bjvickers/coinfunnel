'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('validate.js')
const constraints = require('../../forms/constraints/post-cause')

const formName = `form[name='cause']`
const fieldId1 = '#cause_address1'
const fieldId2 = '#cause_address2'
const fieldId3 = '#cause_address3'
const editId = '#cause-address-edit'
const submitId = '#cause-address-submit'
const cancelId = '#cause-address-cancel'
const successBadgeId = '#cause-address-saved'
const errorDivId = '#cause-address-error'

const handleSuccess = (data, textStatus, jqXHR) => {
  setDisabledFields(true)
  
  $(editId).removeClass('d-none')
  $(submitId).addClass('d-none')
  $(cancelId).addClass('d-none')
  $(submitId).prop('disabled', false)
  $(cancelId).prop('disabled', false)
  $(errorDivId).text('')
  $(errorDivId).addClass('d-none')
  
  resetLS()
  $(successBadgeId).removeClass('d-none')
  window.location.replace(data)
}

const handleSubmitFailure = (jqXHR, textStatus, errorThrown) => {
  handlers.handleErrorEvent(jqXHR.responseJSON, errorDivId, submitId)
  $(cancelId).prop('disabled', false)
}

const setDisabledFields = (isDisabled) => {
  $(fieldId1).prop('disabled', isDisabled)
  $(fieldId2).prop('disabled', isDisabled)
  $(fieldId3).prop('disabled', isDisabled)
}

const setFieldValuesFromLS = () => {
  if (window.localStorage.getItem(fieldId1) !== null) {
    $(fieldId1).val(window.localStorage.getItem(fieldId1))
  }
  if (window.localStorage.getItem(fieldId2) !== null) {
    $(fieldId2).val(window.localStorage.getItem(fieldId2))
  }
  if (window.localStorage.getItem(fieldId3) !== null) {
    $(fieldId3).val(window.localStorage.getItem(fieldId3))
  }
}

const resetLS = () => {
  window.localStorage.removeItem(fieldId1)
  window.localStorage.removeItem(fieldId2)
  window.localStorage.removeItem(fieldId3)
}

const buildSchema = () => {
  const schema = {}
  schema[fieldId1.substr(1)] = $(fieldId1).val()
  schema[fieldId2.substr(1)] = $(fieldId2).val()
  schema[fieldId3.substr(1)] = $(fieldId3).val()
  return schema
}

const handleUpdate = () => {
  const form = $(formName)
  form.submit((e) => e.preventDefault())

  setDisabledFields(true)
  setFieldValuesFromLS()
  resetLS()

  $(fieldId1).on('keypress', () => {
    $(errorDivId).text('')
    $(errorDivId).addClass('d-none')
  })

  $(fieldId2).on('keypress', () => {
    $(errorDivId).text('')
    $(errorDivId).addClass('d-none')
  })

  $(fieldId3).on('keypress', () => {
    $(errorDivId).text('')
    $(errorDivId).addClass('d-none')
  })

  $(editId).on('click', () => {
    setDisabledFields(false)

    $(editId).addClass('d-none')
    $(submitId).removeClass('d-none')
    $(cancelId).removeClass('d-none')

    window.localStorage.setItem(fieldId1, $(fieldId1).val())
    window.localStorage.setItem(fieldId2, $(fieldId2).val())
    window.localStorage.setItem(fieldId3, $(fieldId3).val())
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
    handlers.prepareDataForSubmission(fieldId1)
    handlers.prepareDataForSubmission(fieldId2)
    handlers.prepareDataForSubmission(fieldId3)
    const schema = buildSchema()
    const errors = validate(schema, constraints, { fullMessages: false })
    if (errors) {
      handlers.handleErrorEvent(errors, errorDivId, submitId)
      return
    }

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
