'use strict'

let wallets = []

const findCurrentByUserId = async (userId) => {
  const found = wallets.filter(wallet => wallet.dateRemoved === null && wallet.userId === userId)
  return found.length ? found[0] : null
}

const findPreviousByUserId = async (userId) => {
  return wallets.filter(wallet => wallet.dateRemoved !== null && wallet.userId === userId)
}

const persist = async (wallet) => {
  wallets.push(wallet)
  return wallet
}

const remove = (wallet) => {
  wallets = wallets.filter(storedWallet => storedWallet.id !== wallet.id)
}

const removeAll = () => {
  wallets = []
}

module.exports = () => {
  return {
    findCurrentByUserId,
    findPreviousByUserId,
    persist,
    remove,
    removeAll
  }
}
