'use strict'

const bcrypt = require('bcryptjs')
const config = require('config')

const SALT_WORK_FACTOR = Number(config.get('password.salt_work_factor'))

let inject = null

const isClearPasswordCorrect = (clearPassword, encryptedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(clearPassword, encryptedPassword, (err, isMatch) => {
      if (err) {
        inject.logService.info({ err: err }, 'Error validating a password')
        return reject(err)
      }
      return resolve(isMatch)
    })
  })
}

const getEncPasswordFromClearPassword = (clearPassword) => {
  return new Promise((resolve, reject) => {
    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) {
        inject.logService.info({ err: err }, 'Error generating a salt')
        return reject(err)
      }

      // Hash the password using our new salt
      bcrypt.hash(clearPassword, salt, (err, encryptedPassword) => {
        if (err) {
          inject.logService.info({ err: err }, 'Error hashing a password')
          return reject(err)
        }
        return resolve(encryptedPassword)
      })
    })
  })
}

module.exports = (injector) => {
  inject = injector
  return {
    isClearPasswordCorrect,
    getEncPasswordFromClearPassword
  }
}
