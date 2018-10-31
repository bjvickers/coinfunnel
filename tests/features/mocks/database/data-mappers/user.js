'use strict'

let users = []
let nextUserId = 0

const find = (user) => {
  const found = users.filter(storedUser => storedUser.email === user.email || storedUser.id === user.id)
  return found.length ? found[0] : null
}

const persist = (user) => {
  if (!user.id) {
    user.id = ++nextUserId
  }

  let matchingUser = find(user)
  if (matchingUser) {
    // Overwrite with the latest values
    matchingUser = user
  } else {
    // Add new user
    users.push(user)
  }
  return user
}

const remove = (user) => {
  users = users.filter(storedUser => storedUser.id !== user.id && storedUser.email !== user.email)
}

const removeAll = () => {
  users = []
  nextUserId = 0
}

module.exports = () => {
  return {
    find,
    persist,
    remove,
    removeAll
  }
}
