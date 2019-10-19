const axios = require('axios')
const isServer = require('detect-node')

const { identifyClient } = require('./lib/client-identity')
const { makeIndependent } = require('./lib/independence')

const DEFAULT_OPTIONS = {
  independent: false
}

exports.createClient = (options = { }) => {
  options = Object.assign({ }, DEFAULT_OPTIONS, options)
  const client = axios.create(options.axiosOptions)

  identifyClient(client, options.clientId)

  if (isServer) {
    const { correlate } = require('./lib/correlation')
    correlate(client)
  }

  if (options.independent) {
    makeIndependent(client, axios.defaults.adapater, options.independenceOptions)
  }

  return client
}
