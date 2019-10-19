const chai = require('chai')
const axios = require('axios')
const spies = require('chai-spies')
const proxyquire = require('proxyquire')
const Promise = require('bluebird')

chai.use(spies)

const mockResponse = {
  data: { field1: 'value1' },
  status: 200,
  statusText: 'OK',
  config: { url: 'https://url', method: 'POST' }
}
let mockAdapter
const mockLogger = { }

const { logRequests, logResponses } = proxyquire('../../lib/logging', {
  '@first-lego-league/ms-logger': {
    Logger: function () {
      return mockLogger
    }
  }
})

const expect = chai.expect

describe('logging', () => {
  let client

  beforeEach(() => {
    mockLogger.debug = chai.spy()
    mockLogger.info = chai.spy()
    mockLogger.warn = chai.spy()
    mockAdapter = () => Promise.resolve(mockResponse)
    client = axios.create({ adapter: mockAdapter })
  })

  it('logs requests with level INFO if logRequests was called, wihtout any options', () => {
    logRequests(client)
    return client.get()
      .then(() => {
        expect(mockLogger.info).to.have.been.called()
      })
  })

  it('logs requests with level INFO if logRequests was called, with non-existing option level', () => {
    logRequests(client, { requestLogLevel: 'BLA' })
    return client.get()
      .then(() => {
        expect(mockLogger.info).to.have.been.called()
      })
  })

  it('logs requests with level WARN if logRequests was called, with requestLogLevel = warn', () => {
    logRequests(client, { requestLogLevel: 'warn' })
    return client.get()
      .then(() => {
        expect(mockLogger.warn).to.have.been.called()
      })
  })

  it('logs responses with level DEBUG if logResponses was called, wihtout any options', () => {
    logResponses(client)
    return client.get()
      .then(() => {
        expect(mockLogger.debug).to.have.been.called()
      })
  })

  it('logs responses with level DEBUG if logResponses was called, with non-existing option level', () => {
    logResponses(client, { responseLogLevel: 'BLA' })
    return client.get()
      .then(() => {
        expect(mockLogger.debug).to.have.been.called()
      })
  })

  it('logs responses with level WARN if logResponses was called, with responseLogLevel = warn', () => {
    logResponses(client, { responseLogLevel: 'warn' })
    return client.get()
      .then(() => {
        expect(mockLogger.warn).to.have.been.called()
      })
  })
})
