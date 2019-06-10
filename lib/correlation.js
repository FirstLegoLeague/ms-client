const { getCorrelationId } = require('@first-lego-league/ms-correlation')

exports.correlatedClient = client => {
  client.interceptors.request.use(request => {
    request.headers['correlation-id'] = getCorrelationId()
    return request
  })

  return client
}
