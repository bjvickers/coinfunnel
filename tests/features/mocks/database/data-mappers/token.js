'use strict'

let tokens = []

const find = (tokenString) => {
  const found = tokens.filter(storedToken => storedToken.token === tokenString)
  return found.length ? found[0] : null
}

const persist = (token) => {
  tokens.push(token)
  return token
}

const remove = (token) => {
  tokens = tokens.filter(storedToken => storedToken.token !== token.token)
}

const removeAll = () => {
  tokens = []
}

module.exports = () => {
  return {
    find,
    persist,
    remove,
    removeAll
  }
}
