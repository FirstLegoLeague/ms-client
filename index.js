const axios = require('axios')

const { correlate } = require('./lib/correlation')
const { makeIndependent } = require('./lib/independence')

const DEFAULT_OPTIONS = {
  independent: false
}

exports.createClient = (options = { }) => {
  Object.assign(options, DEFAULT_OPTIONS)
  const client = axios.create(options.axiosOptions)

  correlate(client)

  if (options.independent) {
    makeIndependent(client, axios.defaults.adapater, options.independenceOptions)
  }

  return client
}
