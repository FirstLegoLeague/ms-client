const { Logger } = require('@first-lego-league/ms-logger')

const logger = new Logger()

exports.logRequests = (client, options = { }) => {
  const logMethod = logger[options.requestLogLevel || 'info'] || logger.info

  client.interceptors.request.use(request => {
    logMethod(`Request: ${request.method} ${request.url}`)
    return request
  })
}

exports.logResponses = (client, options = { }) => {
  const logMethod = logger[options.responseLogLevel || 'debug'] || logger.debug

  client.interceptors.response.use(response => {
    logMethod(`Response: ${response.config.method} ${response.config.url} (${response.status} ${response.statusText})`)
    return response
  })
}
