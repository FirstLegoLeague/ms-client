const axios = require('axios')

const { correlatedClient } = require('./lib/correlation')
const { independentClient } = require('./lib/independence')

const DEFAULT_OPTIONS = {
  correlated: true,
  independent: false
}

exports.generateClient = (options = DEFAULT_OPTIONS) => {
  let axiosInstance = axios.create(options.axiosOptions)

  if (options.correlated) {
    axiosInstance = correlatedClient(axiosInstance)
  }

  if (options.independent) {
    axiosInstance = independentClient(axiosInstance)
  }

  return axiosInstance
}
