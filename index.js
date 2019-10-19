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
    const { logRequests, logResponses } = require('./lib/logging')

    correlate(client)
    logRequests(client, options.logging)
    logResponses(client, options.logging)
  }

  if (options.independent) {
    makeIndependent(client, axios.defaults.adapater, options.independenceOptions)
  }

  return client
}
