const axios = require('axios')
const Promise = require('bluebird')

const { identifyClient } = require('./client_identity')
const { makeIndependent } = require('./independence')

const DEFAULT_OPTIONS = {
  independent: false,
  promise: Promise
}

exports.createClient = (options = { }) => {
  options = Object.assign({ }, DEFAULT_OPTIONS, options)
  const client = axios.create(options.axiosOptions)

  identifyClient(client, options.clientId)

  if (options.independent) {
    makeIndependent(client, axios.defaults.adapter, options.promise)
  }

  return client
}
