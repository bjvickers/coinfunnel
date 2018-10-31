'use strict'

const config = require('config')
const elasticsearch = require('elasticsearch')

let inject = null
let client = null

const connect = () => {
  if (!client) {
    client = new elasticsearch.Client({
      host: `${config.get('search.elasticsearch.search_conn')}`,
      log: config.get('search.elasticsearch.log'),
      sniffOnStart: config.get('search.elasticsearch.sniff_on_start'),
      sniffInterval: config.get('search.elasticsearch.sniff_interval'),
      sniffOnConnectionFault: config.get('search.elasticsearch.sniff_on_conn_fault'),
      keepAlive: config.get('search.elasticsearch.keep_alive'),
      maxRetries: config.get('search.elasticsearch.max_conn_retries')
    })
  }
}

const getClient = () => client

module.exports = (injector) => {
  inject = injector
  return {
    connect,
    getClient,
    getCauseDataMapper: () => inject.searchCauseDataMapper
  }
}
