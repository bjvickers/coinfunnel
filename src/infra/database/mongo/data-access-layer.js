'use strict'

/**
 * Entry point for the mongo db service.
 */

const config = require('config')
const mongoose = require('mongoose')

let inject = null
let isConnected = false

const connect = () => {
  if (!isConnected) {
    const conn = `${config.get('database.mongo.db_conn')}/${config.get('database.mongo.db_name')}`
    mongoose.Promise = global.Promise
    mongoose.connect(conn, {
      reconnectTries: Number.MAX_VALUE,
      autoReconnect: true,
      useMongoClient: true
    })
    isConnected = true
  }
}

const disconnect = () => {
  mongoose.connection.close(() => {
    inject.logService.info({}, 'Closed Mongo connection successfully. Exiting...')
    process.exit(0)
  })
}

module.exports = (injector) => {
  inject = injector
  return {
    connect,
    disconnect,
    getUserDataMapper: () => inject.dbUserDataMapper,
    getWalletDataMapper: () => inject.dbWalletDataMapper,
    getCauseDataMapper: () => inject.dbCauseDataMapper,
    getCauseImageDataMapper: () => inject.dbCauseImageDataMapper,
    getTokenDataMapper: () => inject.dbTokenDataMapper,
    getNoticeDataMapper: () => inject.dbNoticeDataMapper,
    getPayoutCronDataMapper: () => inject.dbPayoutCronDataMapper,
    getCausePayoutDataMapper: () => inject.dbCausePayoutDataMapper,
    getTotalsDataMapper: () => inject.dbTotalsDataMapper
  }
}
