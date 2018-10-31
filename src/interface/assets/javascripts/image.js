'use strict'

const $ = require('jquery')
const handlers = require('./handlers')

const resource = '/dashboard/cause/image'
const resMakePrimary = '/dashboard/cause/primary-image'
const addImage = '#add-image'
const radioName = 'image-primary-status'
const togglePrimary = `input:radio[name=${radioName}]`
const deleteImage = '.delete-image'
const errorDivId = '#image-error-notices'

const handleIgnore = (data, textStatus, jqXHR) => {}

const handleSaveFailure = (jqXHR, textStatus, errorThrown) => {
  $(errorDivId).html(jqXHR.responseJSON)
  $(errorDivId).removeClass("d-none")
}

const handleImageDelete = (element) => {
  const publicImageId = $(element).data('image-id')
  $.ajax({
    type: 'delete',
    url: `${resource}/${publicImageId}`,
    statusCode: {
      200: (data, textStatus, jqXHR) => window.location.replace(data),
      400: handleIgnore,
      403: handleIgnore,
      404: handleIgnore,
      500: handleIgnore
    }
  })
}

const handleImages = () => {
  // Handle deletions
  $(deleteImage).on('click', function (event) {
    event.preventDefault()
    handleImageDelete(this)
  })

  $(togglePrimary).on('change', function (event) {
    const schema = {
      public_id: $(`input[name=${radioName}]:checked`, '#image-form').val()
    }
    $.ajax({
      type: 'post',
      url: resMakePrimary,
      data: schema,
      dataType: 'json',
      statusCode: {
        200: (data, textStatus, jqXHR) => window.location.replace(data),
        400: handleSaveFailure,
        403: handleSaveFailure,
        500: handleSaveFailure
      }
    })
  })

  // Handle uploads
  $(addImage).on('click', function (event) {
    event.preventDefault()
    const presetOptions = {
      cloud_name: 'duxrqq19b',
      upload_preset: 'kcxvvt6p',
      multiple: false,
      max_file_size: 1000000,
      theme: 'white',
      sources: ['local', 'url'],
      show_powered_by: false
    }

    cloudinary.openUploadWidget(presetOptions, function (error, result) {
      if (error) {
        return
      }
  
      const schema = {
        public_id: result[0].public_id,
        thumbnail_url: result[0].thumbnail_url,
        secure_url: result[0].secure_url,
        path: result[0].path
      }
  
      $.ajax({
        type: 'post',
        url: resource,
        data: schema,
        dataType: 'json',
        statusCode: {
          200: (data, textStatus, jqXHR) => window.location.replace(data),
          400: handleSaveFailure,
          403: handleSaveFailure,
          500: handleSaveFailure
        }
      })
    })
  })
}

module.exports = {
  handleImages
}
