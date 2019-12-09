const axios = require('axios')

const { identifyClient } = require('./client_identity')
const { makeIndependent } = require('./independence')

const DEFAULT_OPTIONS = {
  independent: false
}

exports.createClient = (options = { }) => {
  options = Object.assign({ }, DEFAULT_OPTIONS, options)
  const client = axios.create(options.axiosOptions)

  identifyClient(client, options.clientId)

  if (options.independent) {
    makeIndependent(client, axios.defaults.adapater, options.promise)
  }

  return client
}
