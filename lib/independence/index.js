const Promise = require('bluebird')

const { IndependentRequest } = require('./independent_request')

const RETRY_TIME = 5 * 1000 // 5 seconds

const retryPendingRequests = originalAdapter => {
  return Promise.all(IndependentRequest.all().map(request => request.send(originalAdapter)))
}

const generateIndependenceAdapter = originalAdapter => {
  return data => {
    return new IndependentRequest(data).send(originalAdapter)
      .then(() => retryPendingRequests(originalAdapter))
  }
}

exports.makeIndependent = (client, originalAdapter) => {
  client.defaults.adapter = generateIndependenceAdapter(originalAdapter)
  client.interval = setInterval(() => retryPendingRequests(originalAdapter), RETRY_TIME)
}
