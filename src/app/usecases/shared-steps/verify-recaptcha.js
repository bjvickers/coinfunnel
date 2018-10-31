'use strict'

const config = require('config')
const request = require('request')

class VerifyRecaptchaStep {
  constructor (inject) {
    this.inject = inject
  }

  getRecapchaVerification (form, recaptchaResponse) {
    return new Promise((resolve, reject) => {
      const url = config.get('recaptcha.verification_url')
      const payload = {
        secret: null,
        response: recaptchaResponse
      }

      if (form === 'login') {
        payload.secret = config.get('recaptcha.login_secret')
      } else if (form === 'register') {
        payload.secret = config.get('recaptcha.register_secret')
      } else if (form === 'reset_password') {
        payload.secret = config.get('recaptcha.reset_password_secret')
      } else {
        this.inject.logService.error({}, 'VerifyRecaptchaStep::Unknown form')
      }

      request.post(url, { form: payload }, (err, res, body) => {
        if (err) {
          return reject(err)
        }
        return resolve(JSON.parse(body))
      })
    })
  }

  async execute (form, recaptchaResponse) {
    try {
      this.inject.logService.debug({ form: form, userresponse: recaptchaResponse }, 'Attempting google recaptcha verification...')
      const response = await this.getRecapchaVerification(form, recaptchaResponse)
      if (response.success) {
        this.inject.logService.debug({ form: form, userresponse: recaptchaResponse }, 'Google recaptcha verification success')
        return true
      }
    } catch (err) {
      this.inject.logService.error({ form: form, userresponse: recaptchaResponse }, 'Error whilst querying google recaptcha')
    }
    this.inject.logService.debug({ form: form, userresponse: recaptchaResponse }, 'Google recaptcha verification fail')
    return false
  }
}

module.exports = VerifyRecaptchaStep
