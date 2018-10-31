'use strict'

const config = require('config')
const jwt = require('jsonwebtoken')

let logService = null
let UserFactory = null

const createJWToken = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      user.toJSONWithoutPassword(),
      config.get('token.secret'),
      {
        expiresIn: config.get('token.duration')
      },
      (err, token) => {
        if (err) {
          return reject(err)
        }
        return resolve(token)
      }
    )
  })
}

const getJWToken = (req) => req.cookies.token || null

const getUserByJWToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.get('token.secret'), (err, userJson) => {
      if (err) {
        logService.error({ err: err }, 'Error verifying the json web token')
        return resolve(null)
      }
      return resolve(UserFactory.createUserFromJSON(userJson))
    })
  })
}

module.exports = (injector) => {
  logService = injector.logService
  UserFactory = injector.UserFactory
  return {
    createJWToken,
    getJWToken,
    getUserByJWToken
  }
}
