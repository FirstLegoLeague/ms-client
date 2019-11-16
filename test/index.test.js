const chai = require('chai')
const spies = require('chai-spies')
const proxyquire = require('proxyquire')

chai.use(spies)

let correlationSpy
let requestsLogSpy
let responsesLogSpy
let clientFactorySpy

global.window = global.window || { }
window.localStorage = global.localStorage

const { createClient } = proxyquire('../', {
  './lib/correlation': {
    correlate: function () {
      correlationSpy.apply(this, arguments)
    }
  },
  './lib/logging': {
    logRequests: function () {
      requestsLogSpy.apply(this, arguments)
    },
    logResponses: function () {
      responsesLogSpy.apply(this, arguments)
    }
  },
  './lib/client_factory': {
    createClient: function () {
      return clientFactorySpy.apply(this, arguments)
    }
  }
})

const expect = chai.expect

describe('ms-client in server', () => {
  beforeEach(() => {
    correlationSpy = chai.spy(() => {})
    requestsLogSpy = chai.spy(() => {})
    responsesLogSpy = chai.spy(() => {})
    clientFactorySpy = chai.spy(() => {})
  })

  it('returns a client from the client factory', () => {
    createClient()
    expect(clientFactorySpy).to.have.been.called()
  })

  it('returns a client which is correlated', () => {
    createClient()
    expect(correlationSpy).to.have.been.called()
  })

  it('returns a client which logs requests', () => {
    createClient()
    expect(requestsLogSpy).to.have.been.called()
  })

  it('returns a client which logs requests with passed options if logging options passed', () => {
    const loggingOptions = { }
    createClient({ logging: loggingOptions })
    expect(requestsLogSpy).to.have.been.called.with(loggingOptions)
  })

  it('returns a client which logs responses if in server', () => {
    createClient()
    expect(responsesLogSpy).to.have.been.called()
  })

  it('returns a client which logs responses with passed options if logging options passed', () => {
    const loggingOptions = { }
    createClient({ logging: loggingOptions })
    expect(responsesLogSpy).to.have.been.called.with(loggingOptions)
  })
})
