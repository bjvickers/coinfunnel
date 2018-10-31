'use strict'

const PostRegisterConstraints = {
  first_name: {
    presence: {
      allowEmpty: false,
      message: 'First name is empty'
    },
    length: {
      maximum: 50,
      message: 'First name should be less than 50 characters long'
    }
  },
  last_name: {
    presence: {
      allowEmpty: false,
      message: 'Last name is empty'
    },
    length: {
      maximum: 50,
      message: 'Last name should be less than 50 characters long'
    }
  },
  user_email: {
    presence: true,
    length: {
      maximum: 60,
      message: 'Email address should be less than 60 characters long'
    },
    email: {
      message: 'Email address is invalid'
    }
  },
  user_password: {
    format: {
      pattern: '[a-zA-Z0-9 ]*',
      message: 'Password contains invalid characters'
    },
    length: {
      minimum: 10,
      maximum: 60,
      message: 'Password should be between 10 and 60 characters long'
    }
  },
  user_role: {
    presence: true,
    inclusion: {
      within: null,
      message: 'User account type is not recognised'
    }
  }
}

module.exports = (inject) => {
  PostRegisterConstraints.user_role.inclusion.within = [ inject.UserRoles.cause, inject.UserRoles.donator ]
  return PostRegisterConstraints
}
