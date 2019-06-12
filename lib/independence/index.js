const Promise = require('bluebird')
const { Axios } = require('axios')

const { IndependentRequest } = require('./independence/independent_request')

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

Axios.prototype.independent = function () {
  const originalAdapter = this.adapter
  this.adapter = generateIndependenceAdapter(originalAdapter)
  setInterval(() => retryPendingRequests(originalAdapter), RETRY_TIME)
}
