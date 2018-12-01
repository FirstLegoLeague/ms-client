'use strict'
/* eslint node/no-unsupported-features: 0 */

const axios = require('axios')
const { getCorrelationId } = require('@first-lego-league/ms-correlation')
const Promise = require('bluebird')

axios.interceptors.request.use(config => {
  config.headers['correlation-id'] = getCorrelationId()
  return config
}, error => Promise.reject(error))

exports.client = axios
