const axios = require('axios')

require('./lib/correlation')
require('./lib/independence')

const DEFAULT_OPTIONS = {
  independent: false
}

exports.client = (options = DEFAULT_OPTIONS) => {
  const client = axios.create(options.axiosOptions)

  client.correlate()

  if (options.independent) {
    client.independent()
  }

  return client
}
