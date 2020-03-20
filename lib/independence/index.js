const { IndependentRequest } = require('./independent_request')
const { LocalStorageNamespace } = require('./local_storage_namespace')

const RETRY_TIME = 5 * 1000 // 5 seconds

exports.makeIndependent = (client, originalAdapter, promise) => {
  const storage = new LocalStorageNamespace('independentRequests')

  const retryPendingRequests = () => {
    return promise.all(IndependentRequest.all(storage).map(request => request.send(originalAdapter)))
  }

  const generateIndependenceAdapter = () => {
    return data => {
      return new IndependentRequest({ data, storage }).send(originalAdapter)
        .then(response => {
          retryPendingRequests()
          return response
        })
    }
  }

  IndependentRequest.all(storage)
    .filter(request => request.data.method === 'get')
    .forEach(request => request.delete())

  client.defaults.adapter = generateIndependenceAdapter()
  client.interval = setInterval(() => retryPendingRequests(), RETRY_TIME)
}
