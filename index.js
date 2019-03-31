'use strict'

const axios = require('axios')
const { getCorrelationId } = require('@first-lego-league/ms-correlation')

exports.client = axios.create({
  transformRequest: [(data, headers) => {
    headers['correlation-id'] = getCorrelationId()
    return JSON.stringify(data)
  }]
})
