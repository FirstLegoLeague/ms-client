const chai = require('chai')
const axios = require('axios')
const spies = require('chai-spies')
const proxyquire = require('proxyquire')
const Promise = require('bluebird')

chai.use(spies)

const mockResponse = {
  data: { field1: 'value1' },
  status: 200
}
const presetClientId = 'some-id'
const randomClientId = 'ramdon-id'
let mockAdapter
let randomize

const { identifyClient } = proxyquire('../../lib/client-identity', {
  randomatic: function () {
    return randomize.apply(this, arguments)
  }
})

const expect = chai.expect

describe('client identity', () => {
  let clientWithPresetId, clientWithoutPresetId
  let lastRequest

  beforeEach(() => {
    randomize = chai.spy(() => randomClientId)
    mockAdapter = () => Promise.resolve(mockResponse)

    clientWithPresetId = axios.create({ adapter: mockAdapter })
    identifyClient(clientWithPresetId, presetClientId)

    clientWithoutPresetId = axios.create({ adapter: mockAdapter })
    identifyClient(clientWithoutPresetId)

    clientWithPresetId.interceptors.request.use(request => {
      lastRequest = request
      return request
    })

    clientWithoutPresetId.interceptors.request.use(request => {
      lastRequest = request
      return request
    })
  })

  it('requests of client with preset client id have the preset client-id header', () => {
    return clientWithPresetId.get()
      .then(() => {
        expect(lastRequest.headers['client-id']).to.equal(presetClientId)
      })
  })

  it('requests of client without preset client id have a random client-id header', () => {
    return clientWithoutPresetId.get()
      .then(() => {
        expect(lastRequest.headers['client-id']).to.equal(randomClientId)
      })
  })
})
