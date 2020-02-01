const { IndependentRequest } = require('./independent_request')
const { LocalStorageNamespace } = require('./local_storage_namespace')

const RETRY_TIME = 5 * 1000 // 5 seconds

exports.makeIndependent = (client, originalAdapter, promise) => {
  const storage = new LocalStorageNamespace('independentRequests')

  const retryPendingRequests = (originalAdapter, promise) => {
    const Promise = promise || global.Promise
    return Promise.all(IndependentRequest.all().map(request => request.send(originalAdapter, storage)))
  }

  const generateIndependenceAdapter = (originalAdapter, promise) => {
    return data => {
      return new IndependentRequest({ data, storage }).send(originalAdapter)
        .then(() => retryPendingRequests(originalAdapter, promise))
    }
  }

  IndependentRequest.all(storage)
    .filter(request => request.data.method === 'get')
    .forEach(request => request.delete())

  client.defaults.adapter = generateIndependenceAdapter(originalAdapter, promise)
  client.interval = setInterval(() => retryPendingRequests(originalAdapter, promise), RETRY_TIME)
}
