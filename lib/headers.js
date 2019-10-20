const isServer = require('detect-node')

if (isServer) {
  exports.headers = client => {
    const headers = { 'client-id': client.clientId }
    return headers
  }
} else {
  exports.headers = client => {
    const { getCorrelationId } = require('@first-lego-league/ms-correlation')
    const headers = { 'client-id': client.clientId, 'correlation-id': getCorrelationId() }
    return headers
  }
}
