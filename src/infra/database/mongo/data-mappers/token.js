'use strict'

let inject = null
let TokenSchema = null
let TokenFromDbTokenMapping = null

const find = (tokenString) => {
  return new Promise((resolve, reject) => {
    TokenSchema.findOne({ token: tokenString }, (err, tokenSchema) => {
      if (err) {
        inject.logService.info({ err: err, token: tokenString }, 'Error locating existing Token')
        return reject(err)
      }

      if (!tokenSchema) {
        return resolve(null)
      }
      return resolve(inject.TokenFactory.createTokenFromSchema(tokenSchema, TokenFromDbTokenMapping))
    })
  })
}

const persist = (token) => {
  return new Promise(async (resolve, reject) => {
    const tokenSchema = new TokenSchema()
    tokenSchema.user_id = token.userId
    tokenSchema.token = token.token
    tokenSchema.type = token.type
    tokenSchema.save((err) => {
      if (err) {
        inject.logService.info({ err: err, token: token }, 'Error saving the TokenSchema')
        return reject(err)
      }
      return resolve(token)
    })
  })
}

/**
 * Removes all tokens of type {TokenTypes} for the User identified in token.userId
 * @param {Token} token
 */
const remove = (token) => {
  return new Promise((resolve, reject) => {
    TokenSchema.remove({ user_id: token.userId, type: token.type }, (err) => {
      if (err) {
        inject.logService.info({ err: err, token: token }, 'Error whilst deleting token')
        return reject(err)
      }
      return resolve()
    })
  })
}

const removeAll = async () => {
  try {
    await inject.dbDataMapperDecorator.removeAll(TokenSchema)
    inject.logService.info({}, 'Token::RemoveAll decorator attached to DAL')
  } catch (err) {
    inject.logService.info({}, 'Token::RemoveAll decorator not attached to DAL')
  }
}

module.exports = (injector) => {
  inject = injector
  TokenSchema = inject.TokenSchema
  TokenFromDbTokenMapping = inject.TokenFromDbTokenMapping

  return {
    find,
    persist,
    remove,
    removeAll
  }
}
