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

const mockStorage = {
  put: (key, value) => { mockStorage._data[key] = value },
  get: key => mockStorage._data[key],
  delete: key => { delete mockStorage._data[key] },
  all: () => mockStorage._data,
  _data: {}
}
const getMockStorage = chai.spy(() => mockStorage)

const { makeIndependent } = proxyquire('../../../lib/independence', {
  './independent_request': {
    IndependentRequest
  },
  './local_storage_namespace': {
    LocalStorageNamespace: getMockStorage
  }
})

const expect = chai.expect

function expectPendingRequestsToBeRetried () {
  expect(IndependentRequest.all).to.have.been.called(2)
  pendingRequests.forEach(request => {
    expect(request.send).to.have.been.called()
  })
}

function expectPendingRequestsToNotBeRetried () {
  expect(IndependentRequest.all).to.have.been.called(1)
  pendingRequests.forEach(request => {
    expect(request.send).to.not.have.been.called()
  })
}

describe('independence', () => {
  let client
  let clock
  const sandbox = chai.spy.sandbox()

  beforeEach(() => {
    mockAdapter = () => Promise.resolve(mockResponse)
    pendingRequests = [
      { send: chai.spy(() => Promise.resolve(mockResponse)), delete: chai.spy(() => { }), data: { method: 'get' } },
      { send: chai.spy(() => Promise.resolve(mockResponse)), delete: chai.spy(() => { }), data: { method: 'post' } },
      { send: chai.spy(() => Promise.resolve(mockResponse)), delete: chai.spy(() => { }), data: { method: 'get' } },
      { send: chai.spy(() => Promise.resolve(mockResponse)), delete: chai.spy(() => { }), data: { method: 'delete' } },
      { send: chai.spy(() => Promise.resolve(mockResponse)), delete: chai.spy(() => { }), data: { method: 'post' } }
    ]
    IndependentRequest.all = chai.spy(() => pendingRequests)
    client = axios.create({ adapter: mockAdapter })
    makeIndependent(client, mockAdapter, Promise)
    clock = sinon.useFakeTimers()
    mockStorage._data = { }
    sandbox.on(mockStorage, ['put', 'get', 'all'])
  })

  afterEach(() => {
    sandbox.restore()
    clock.restore()
    clearInterval(client.interval)
  })

  it('clears all old GET requests', () => {
    pendingRequests
      .filter(request => request.data.method === 'get')
      .forEach(request => expect(request.delete).to.have.been.called())
  })

  it('does not clear any of the old requests whic are not in GET method', () => {
    pendingRequests.filter(request => request.data.method !== 'get')
      .forEach(request => expect(request.delete).not.to.have.been.called())
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
        expectPendingRequestsToBeRetried()
      })
  })

  it('does not retry all pending requests on failure', () => {
    const error = new Error('some error')
    error.status = 500
    requestMock.send = () => Promise.reject(error)
    return client.get()
      .then(() => { expect.fail() })
      .catch(() => {
        expectPendingRequestsToNotBeRetried()
      })
  })

  it('sets an interval to retry pending requests every 5 seconds', () => {
    expect(client.interval).to.exist
    expect(client.interval._repeat).to.equal(5000)
    client.interval._onTimeout()
    expectPendingRequestsToBeRetried()
  })
})
