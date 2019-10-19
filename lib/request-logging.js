const { Logger } = require('@first-lego-leagie/ms-logger')

const logger = new Logger()

exports.logRequests = client => {
  client.interceptors.request.use(request => {
    logger.info(`Request: ${request.method} ${request.url}`)
    return request
  })
}

exports.logResponses = client => {
  client.interceptors.response.use(response => {
    logger.debug(`Response: ${response.config.method} ${response.config.url} (${response.status} ${response.statusText})`)
    return response
  })
}
