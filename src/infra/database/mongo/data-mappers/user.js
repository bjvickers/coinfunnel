'use strict'

let inject = null
let UserSchema = null
let UserFromDbUserMapping = null

const find = async (partialUser) => {
  const search = (partialUser.id) ? { user_id: partialUser.id } : { user_email: partialUser.email }
  const userSchema = await _findOne(search)
  if (!userSchema) {
    return null
  }
  return inject.UserFactory.createUserFromSchema(userSchema, UserFromDbUserMapping)
}

const _findOne = (searchSchema) => {
  return new Promise((resolve, reject) => {
    UserSchema.findOne(searchSchema, (err, userSchema) => {
      if (err) {
        inject.logService.error({ err: err, searchSchema: searchSchema }, 'Error locating existing User document')
        return reject(err)
      }
      return resolve(userSchema)
    })
  })
}

const persist = async (user) => {
  try {
    let userSchema = (user.id) ? await _findOne({ user_id: user.id }) : await _findOne({ user_email: user.email })
    userSchema = userSchema || new UserSchema()
    return await _persist(user, userSchema)
  } catch (err) {
    throw err
  }
}

const _persist = (user, userSchema) => {
  return new Promise(async (resolve, reject) => {
    userSchema.user_id = userSchema._id.toString()
    userSchema.user_registration_state = user.registrationState
    userSchema.user_password_state = user.passwordState
    userSchema.user_email = user.email
    userSchema.first_name = user.firstName
    userSchema.last_name = user.lastName
    userSchema.user_encrypted_password = user.password.encryptedPassword
    userSchema.user_role = user.role
    userSchema.last_logged_in = user.lastLoggedIn
    userSchema.currency = user.currency
    userSchema.notices_read = user.noticesRead
    userSchema.notices_deleted = user.noticesDeleted
    userSchema.save((err) => {
      if (err) {
        inject.logService.error({ err: err, user: user.toJSONWithoutPassword() }, 'Error saving the UserSchema')
        return reject(err)
      }
      return resolve(inject.UserFactory.createUserFromSchema(userSchema, UserFromDbUserMapping))
    })
  })
}

const remove = (user) => {
  return new Promise((resolve, reject) => {
    UserSchema.remove({ user_id: user.id }, (err) => {
      if (err) {
        inject.logService.error({ err: err, user: user.toJSONWithoutPassword() }, 'Error whilst deleting user')
        return reject(err)
      }
      return resolve()
    })
  })
}

const removeAll = async () => {
  try {
    await inject.dbDataMapperDecorator.removeAll(UserSchema)
    inject.logService.info({}, 'User::RemoveAll decorator attached to DAL')
  } catch (err) {
    inject.logService.info({}, 'User::RemoveAll decorator not attached to DAL')
  }
}

module.exports = (injector) => {
  inject = injector
  UserSchema = inject.UserSchema
  UserFromDbUserMapping = inject.UserFromDbUserMapping

  return {
    find,
    persist,
    remove,
    removeAll
  }
}
