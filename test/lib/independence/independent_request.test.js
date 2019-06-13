const chai = require('chai')
const sinon = require('sinon')
const spies = require('chai-spies')
const proxyquire = require('proxyquire')
const Promise = require('bluebird')

chai.use(spies)

const mockStorage = {
  put: (key, value) => { mockStorage._data[key] = value },
  get: key => mockStorage._data[key],
  delete: key => { delete mockStorage._data[key] },
  all: () => mockStorage._data,
  _data: {}
}
const getmockStorage = chai.spy(() => mockStorage)
const MOCK_DATE = 1558625994627

const { IndependentRequest } = proxyquire('../../../lib/independence/independent_request', {
  './local_storage_namespace': {
    LocalStorageNamespace: getmockStorage
  }
})

const expect = chai.expect

describe('independent request', () => {
  let clock
  const sandbox = chai.spy.sandbox()

  beforeEach(() => {
    mockStorage._data = { }
    sandbox.on(mockStorage, ['put', 'get', 'all'])
    clock = sinon.useFakeTimers(MOCK_DATE)
  })

  afterEach(() => {
    sandbox.restore()
    clock.restore()
  })

  it('created a storage with the key `independentRequests`', () => {
    expect(getmockStorage).to.have.been.called.with('independentRequests')
    expect(IndependentRequest.storage).to.equal(mockStorage)
  })

  it('defaultly sets the key to be the current date', () => {
    expect(new IndependentRequest().key).to.equal(MOCK_DATE)
  })

  it('calls the adapter with the given data', () => {
    const mockAdapter = chai.spy(() => Promise.resolve({ status: 200 }))
    const data = { }
    const request = new IndependentRequest(data)

    return request.send(mockAdapter).then(() => {
      expect(mockAdapter).to.have.been.called.with(data)
    })
  })

  it('saves the request if it fails with status 500', () => {
    const error = new Error('some error')
    error.status = 500
    const mockAdapter = () => Promise.resolve().then(() => { throw error })
    const key = 'key'
    const data = { }
    const request = new IndependentRequest(data, key)

    return request.send(mockAdapter)
      .then(() => { expect(false).to.equal(true) })
      .catch(() => {
        expect(mockStorage.get(key)).to.equal(data)
      })
  })

  it('saves the request if it fails with status 0', () => {
    const error = new Error('some error')
    error.status = 0
    const mockAdapter = () => Promise.resolve().then(() => { throw error })
    const key = 'key'
    const data = { }
    const request = new IndependentRequest(data, key)

    return request.send(mockAdapter)
      .then(() => { expect(false).to.equal(true) })
      .catch(() => {
        expect(mockStorage.get(key)).to.equal(data)
      })
  })

  it('saves the request if it is successful with status 0', () => {
    const mockAdapter = () => Promise.resolve({ status: 0 })
    const key = 'key'
    const data = { }
    const request = new IndependentRequest(data, key)

    return request.send(mockAdapter)
      .then(() => { expect(false).to.equal(true) })
      .catch(() => {
        expect(mockStorage.get(key)).to.equal(data)
      })
  })

  it('does not save the request if it fails with status 400', () => {
    const error = new Error('some error')
    error.status = 400
    const mockAdapter = () => Promise.resolve().then(() => { throw error })
    const key = 'key'
    const data = { }
    const request = new IndependentRequest(data, key)

    return request.send(mockAdapter)
      .then(() => { expect(false).to.equal(true) })
      .catch(() => {
        expect(mockStorage.get(key)).to.equal(undefined)
      })
  })

  it('does not save the request if it is successful', () => {
    const mockAdapter = () => Promise.resolve({ status: 200 })
    const key = 'key'
    const data = { }
    const request = new IndependentRequest(data, key)

    return request.send(mockAdapter).then(() => {
      expect(mockStorage.get(key)).to.equal(undefined)
    })
  })

  it('all returns an independent request for each entry in the storage', () => {
    mockStorage._data = {
      key1: { field1: 'value', field2: 'another value' },
      key2: { anotherField: 12341, field: 0.524 },
      key3: { field1: 'value3', field2: 'another value1' },
      key4: { field1: true, field2: false }
    }
    const all = IndependentRequest.all()

    expect(all.length).to.eql(Object.keys(mockStorage._data).length)
    all.forEach((request, index) => {
      expect(request instanceof IndependentRequest).to.equal(true)
      expect(request.data).to.equal(Object.values(mockStorage._data)[index])
      expect(request.key).to.equal(Object.keys(mockStorage._data)[index])
    })
  })
})
