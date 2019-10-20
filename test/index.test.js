const chai = require('chai')
const spies = require('chai-spies')
const proxyquire = require('proxyquire')

chai.use(spies)

let isServer
let correlationSpy
let independenceSpy
let clientIdentitySpy
let requestsLogSpy
let responsesLogSpy

global.window = global.window || { }
window.localStorage = global.localStorage

const { createClient } = proxyquire('../', {
  'detect-node': function () {
    return isServer
  },
  './lib/correlation': {
    correlate: function () {
      correlationSpy.apply(this, arguments)
    }
  },
  './lib/independence': {
    makeIndependent: function () {
      independenceSpy.apply(this, arguments)
    }
  },
  './lib/client-identity': {
    identifyClient: function () {
      clientIdentitySpy.apply(this, arguments)
    }
  },
  './lib/logging': {
    logRequests: function () {
      requestsLogSpy.apply(this, arguments)
    },
    logResponses: function () {
      responsesLogSpy.apply(this, arguments)
    }
  }
})

const expect = chai.expect

describe('ms-client', () => {
  beforeEach(() => {
    isServer = false
    correlationSpy = chai.spy(() => {})
    independenceSpy = chai.spy(() => {})
    clientIdentitySpy = chai.spy(() => {})
    requestsLogSpy = chai.spy(() => {})
    responsesLogSpy = chai.spy(() => {})
  })

  it('returns a client which is not correlated if not server', () => {
    isServer = false
    createClient()
    expect(correlationSpy).to.have.been.called()
  })

  it('returns a client which is correlated if in server', () => {
    isServer = true
    createClient()
    expect(correlationSpy).to.have.been.called()
  })

  it('returns a client which does not log requests if not server', () => {
    isServer = false
    createClient()
    expect(requestsLogSpy).to.have.been.called()
  })

  it('returns a client which logs requests if in server', () => {
    isServer = true
    createClient()
    expect(requestsLogSpy).to.have.been.called()
  })

  it('returns a client which logs requests with passed options if in server and logging options passed', () => {
    isServer = true
    const loggingOptions = { }
    createClient({ logging: loggingOptions })
    expect(requestsLogSpy).to.have.been.called.with(loggingOptions)
  })

  it('returns a client which does not log responses if not server', () => {
    isServer = false
    createClient()
    expect(responsesLogSpy).to.have.been.called()
  })

  it('returns a client which logs responses if in server', () => {
    isServer = true
    createClient()
    expect(responsesLogSpy).to.have.been.called()
  })

  it('returns a client which logs responses with passed options if in server and logging options passed', () => {
    isServer = true
    const loggingOptions = { }
    createClient({ logging: loggingOptions })
    expect(responsesLogSpy).to.have.been.called.with(loggingOptions)
  })

  it('returns a client which is not defaulty independent', () => {
    createClient()
    expect(independenceSpy).to.not.have.been.called()
  })

  it('returns a client which is independent if requested to be', () => {
    createClient({ independent: true })
    expect(independenceSpy).to.have.been.called()
  })
})
