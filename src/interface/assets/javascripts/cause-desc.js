'use strict'

const $ = require('jquery')
const handlers = require('./handlers')
const validate = require('validate.js')
const constraints = require('../../forms/constraints/post-cause')

const postCauseResource = '/dashboard/cause'
const fieldId = '#cause_desc'
const editId = '#cause-desc-edit'
const submitId = '#cause-desc-submit'
const cancelId = '#cause-desc-cancel'
const successBadgeId = '#cause-desc-saved'
const errorDivId = '#cause-desc-error'
const charCount = '#cause-desc-length'

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
  setDisabledFields(true)
  setFieldValuesFromLS()
  resetLS()

  $(fieldId).on('keypress', () => {
    $(errorDivId).text('')
    $(errorDivId).addClass('d-none')
    $(charCount).removeClass('d-none')
    $(charCount).text((constraints.cause_desc.length.maximum - $(fieldId).val().length))
  })

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
    $(charCount).addClass('d-none')
    $(charCount).text(constraints.cause_desc.length.maximum)

    setFieldValuesFromLS()
    resetLS()
  })

  $(submitId).on('click', () => {
    handlers.prepareDataForSubmission(fieldId)
    const schema = buildSchema()
    const errors = validate(schema, constraints, { fullMessages: false })
    if (errors) {
      handlers.handleErrorEvent(errors, errorDivId, submitId)
      return
    }

    handlers.handleFormPreSubmit(errorDivId, submitId)
    $(cancelId).prop('disabled', true)
    $(charCount).addClass('d-none')

    $.ajax({
      type: 'post',
      url: postCauseResource,
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
