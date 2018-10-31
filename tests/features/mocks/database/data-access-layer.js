'use strict'

const invokeUserDataMapper = require('./data-mappers/user')
const invokeWalletDataMapper = require('./data-mappers/wallet')
const invokeCauseDataMapper = require('./data-mappers/cause')
const invokeCauseImageDataMapper = require('./data-mappers/cause-image')
const invokeTokenDataMapper = require('./data-mappers/token')
const invokeNoticeDataMapper = require('./data-mappers/notice')
const invokeTotalsDataMapper = require('./data-mappers/totals')

const connect = () => { console.log('Connecting to the data access layer') }
const disconnect = () => { console.log('Disconnecting from the data access layer') }

module.exports = (injector) => {
  const userDataMapper = invokeUserDataMapper()
  const walletDataMapper = invokeWalletDataMapper()
  const causeDataMapper = invokeCauseDataMapper(injector)
  const causeImageDataMapper = invokeCauseImageDataMapper()
  const tokenDataMapper = invokeTokenDataMapper()
  const noticeDataMapper = invokeNoticeDataMapper()
  const totalsDataMapper = invokeTotalsDataMapper()
  
  return {
    connect,
    disconnect,
    getUserDataMapper: () => userDataMapper,
    getWalletDataMapper: () => walletDataMapper,
    getCauseDataMapper: () => causeDataMapper,
    getCauseImageDataMapper: () => causeImageDataMapper,
    getTokenDataMapper: () => tokenDataMapper,
    getNoticeDataMapper: () => noticeDataMapper,
    getTotalsDataMapper: () => totalsDataMapper
  }
}
