const chai = require('chai')
const sinon = require('sinon')
const spies = require('chai-spies')
const axios = require('axios')
const proxyquire = require('proxyquire')
const Promise = require('bluebird')

chai.use(spies)

const requestMock = {
  send: () => Promise.resolve(mockResponse)
}
const mockResponse = {
  data: { field1: 'value1' },
  status: 200
}
let mockAdapter
let pendingRequests
const IndependentRequest = chai.spy(data => {
  requestMock.data = data
  return requestMock
})

const { makeIndependent } = proxyquire('../../../lib/independence', {
  './independent_request': {
    IndependentRequest
  }
})

const expect = chai.expect

function retryedPendingRequests () {
  expect(IndependentRequest.all).to.have.been.called()
  pendingRequests.forEach(request => {
    expect(request.send).to.have.been.called()
  })
}

function didNotRetryPendingRequests () {
  expect(IndependentRequest.all).to.not.have.been.called()
  pendingRequests.forEach(request => {
    expect(request.send).to.not.have.been.called()
  })
}

describe('independence', () => {
  let client
  let clock

  beforeEach(() => {
    mockAdapter = () => Promise.resolve(mockResponse)
    pendingRequests = [{
      send: chai.spy(() => Promise.resolve(mockResponse))
    }, {
      send: chai.spy(() => Promise.resolve(mockResponse))
    }, {
      send: chai.spy(() => Promise.resolve(mockResponse))
    }, {
      send: chai.spy(() => Promise.resolve(mockResponse))
    }, {
      send: chai.spy(() => Promise.resolve(mockResponse))
    }]
    IndependentRequest.all = chai.spy(() => pendingRequests)
    client = axios.create({ adapter: mockAdapter })
    makeIndependent(client)
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
    clearInterval(client.interval)
  })

  it('requests using an independent request', () => {
    return client.get()
      .then(() => {
        expect(IndependentRequest).to.have.been.called()
      })
  })

  it('retries all pending requests on success', () => {
    return client.get()
      .then(() => {
        retryedPendingRequests()
      })
  })

  it('does not retry all pending requests on failure', () => {
    const error = new Error('some error')
    error.status = 500
    requestMock.send = () => Promise.resolve().then(() => { throw error })
    return client.get()
      .then(() => { expect(false).to.equal(true) })
      .catch(() => {
        didNotRetryPendingRequests()
      })
  })

  it('sets an interval to retry pending requests every 5 seconds', () => {
    expect(client.interval).to.not.equal(undefined)
    expect(client.interval._repeat).to.equal(5000)
    client.interval._onTimeout()
    retryedPendingRequests()
  })
})
