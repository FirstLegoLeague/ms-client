const randomize = require('randomatic')

function generateRandomClientId () {
  return randomize('Aa0?', 16, { chars: '+/' })
}

exports.identifyClient = (client, clientId) => {
  clientId = clientId || generateRandomClientId()
  client.interceptors.request.use(request => {
    request.headers['client-id'] = clientId
    return request
  })
}
