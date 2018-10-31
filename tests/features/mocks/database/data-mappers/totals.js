'use strict'

let sumAllPayouts = 0
let sumAllMiners = 0
let sumAllCauseRegistrations = 0

const getTotals = () => {
  return {
    sum_all_payouts: sumAllPayouts,
    sum_all_miners: sumAllMiners,
    sum_all_cause_registrations: sumAllCauseRegistrations
  }
}

const persistSumAllPayouts = (sum) => {
  sumAllPayouts = sum
}

const persistSumAllMiners = (sum) => {
  sumAllMiners = sum
}

const persistSumAllCauseRegistrations = (sum) => {
  sumAllCauseRegistrations = sum
}

const getSumAllPayouts = () => {
  return sumAllPayouts
}

const getSumAllMiners = () => {
  return sumAllMiners
}

module.exports = () => {
  return {
    getTotals,
    getSumAllPayouts,
    getSumAllMiners,
    persistSumAllPayouts,
    persistSumAllMiners,
    persistSumAllCauseRegistrations
  }
}
