const chai = require('chai')
const sinon = require('sinon')
const spies = require('chai-spies')
const Promise = require('bluebird')

chai.use(spies)
const MOCK_DATE = 1558625994627
const mockStorage = {
  put: (key, value) => { mockStorage._data[key] = value },
  get: key => mockStorage._data[key],
  delete: key => { delete mockStorage._data[key] },
  all: () => mockStorage._data,
  _data: {}
}

const { IndependentRequest } = require('../../../lib/independence/independent_request')

const expect = chai.expect

describe('independent request', () => {
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers(MOCK_DATE)
    mockStorage._data = { }
  })

  afterEach(() => {
    clock.restore()
  })

  it('throws an error if not given a storage', () => {
    expect(() => new IndependentRequest()).to.throw()
  })

  it('defaultly sets the key to be the current date', () => {
    expect(new IndependentRequest({ storage: mockStorage }).key).to.equal(MOCK_DATE)
  })

  it('calls the adapter with the given data', () => {
    const mockAdapter = chai.spy(() => Promise.resolve({ status: 200 }))
    const data = { }
    const request = new IndependentRequest({ data, storage: mockStorage })

    return request.send(mockAdapter).then(() => {
      expect(mockAdapter).to.have.been.called.with(data)
    })
  })

  it('saves the request if it fails with status 500', () => {
    const error = new Error('some error')
    error.status = 500
    const mockAdapter = () => Promise.reject(error)
    const key = 'key'
    const data = { }
    const request = new IndependentRequest({ data, key, storage: mockStorage })

    return request.send(mockAdapter)
      .catch(() => { })
      .then(() => {
        expect(request.storage.get(key)).to.equal(data)
      })
  })

  it('saves the request if it fails with status 0', () => {
    const error = new Error('some error')
    error.status = 0
    const mockAdapter = () => Promise.reject(error)
    const key = 'key'
    const data = { }
    const request = new IndependentRequest({ data, key, storage: mockStorage })

    return request.send(mockAdapter)
      .catch(() => { })
      .then(() => {
        expect(request.storage.get(key)).to.equal(data)
      })
  })

  it('saves the request if it is successful with status 0', () => {
    const mockAdapter = () => Promise.resolve({ status: 0 })
    const key = 'key'
    const data = { }
    const request = new IndependentRequest({ data, key, storage: mockStorage })

    return request.send(mockAdapter)
      .catch(() => { })
      .then(() => {
        expect(request.storage.get(key)).to.equal(data)
      })
  })

  it('does not save the request if it fails with status 400', () => {
    const error = new Error('some error')
    error.status = 400
    const mockAdapter = () => Promise.reject(error)
    const key = 'key'
    const data = { }
    const request = new IndependentRequest({ data, key, storage: mockStorage })

    return request.send(mockAdapter)
      .catch(() => { })
      .then(() => {
        expect(request.storage.get(key)).to.be.undefined
      })
  })

  it('does not save the request if it is successful', () => {
    const mockAdapter = () => Promise.resolve({ status: 200 })
    const key = 'key'
    const data = { }
    const request = new IndependentRequest({ data, key, storage: mockStorage })

    return request.send(mockAdapter).then(() => {
      expect(request.storage.get(key)).to.be.undefined
    })
  })

  it('all returns an independent request for each entry in the storage', () => {
    mockStorage._data = {
      key1: { field1: 'value', field2: 'another value' },
      key2: { anotherField: 12341, field: 0.524 },
      key3: { field1: 'value3', field2: 'another value1' },
      key4: { field1: true, field2: false }
    }
    const all = IndependentRequest.all(mockStorage)

    expect(all.length).to.deep.equal(Object.keys(mockStorage._data).length)
    all.forEach((request, index) => {
      expect(request instanceof IndependentRequest).to.be.true
      expect(request.data).to.equal(Object.values(request.storage._data)[index])
      expect(request.key).to.equal(Object.keys(request.storage._data)[index])
    })
  })

  it('all throws an error if not given a storage', () => {
    expect(() => IndependentRequest.all()).to.throw()
  })
})
