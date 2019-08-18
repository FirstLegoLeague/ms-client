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
const correlationId = 'some-id'
let mockAdapter
let getCorrelationId

const { correlate } = proxyquire('../../lib/correlation', {
  '@first-lego-league/ms-correlation': {
    getCorrelationId: function () {
      return getCorrelationId.apply(this, arguments)
    }
  }
})

const expect = chai.expect

describe('correlation', () => {
  let client
  let lastRequest

  beforeEach(() => {
    getCorrelationId = chai.spy(() => correlationId)
    mockAdapter = () => Promise.resolve(mockResponse)
    client = axios.create({ adapter: mockAdapter })
    correlate(client)
    client.interceptors.request.use(request => {
      lastRequest = request
      return request
    })
  })

  it('all requests have a correlation header', () => {
    return client.get()
      .then(() => {
        expect(getCorrelationId).to.have.been.called()
        expect(lastRequest.headers['correlation-id']).to.equal(correlationId)
      })
  })
})
