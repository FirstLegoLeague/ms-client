const { createClient } = require('./lib/client_factory')
const { correlate } = require('./lib/correlation')
const { logRequests, logResponses } = require('./lib/logging')

exports.createClient = (options = { }) => {
  const client = createClient(options)

  correlate(client)
  logRequests(client, options.logging)
  logResponses(client, options.logging)

  return client
}
