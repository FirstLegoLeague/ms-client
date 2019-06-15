const { IndependentRequest } = require('./independent_request')
const { LocalStorageNamespace } = require('./local_storage_namespace')

const RETRY_TIME = 5 * 1000 // 5 seconds
const storage = new LocalStorageNamespace('independentRequests')

const retryPendingRequests = (originalAdapter, options) => {
  const Promise = options.promise || global.Promise
  return Promise.all(IndependentRequest.all().map(request => request.send(originalAdapter, storage)))
}

const generateIndependenceAdapter = (originalAdapter, options) => {
  return data => {
    return new IndependentRequest({ data, storage }).send(originalAdapter)
      .then(() => retryPendingRequests(originalAdapter, options))
  }
}

exports.makeIndependent = (client, originalAdapter, options = { }) => {
  client.defaults.adapter = generateIndependenceAdapter(originalAdapter, options)
  client.interval = setInterval(() => retryPendingRequests(originalAdapter, options), RETRY_TIME)
}
