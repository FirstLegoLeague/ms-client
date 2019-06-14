const { getCorrelationId } = require('@first-lego-league/ms-correlation')

exports.correlate = function (client) {
  client.interceptors.request.use(request => {
    request.headers['correlation-id'] = getCorrelationId()
    return request
  })
}
