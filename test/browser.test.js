const chai = require('chai')
const spies = require('chai-spies')
const proxyquire = require('proxyquire')

chai.use(spies)

let clientFactorySpy

global.window = global.window || { }
window.localStorage = global.localStorage

const { createClient } = proxyquire('../browser', {
  './lib/client_factory': {
    createClient: function () {
      return clientFactorySpy.apply(this, arguments)
    }
  }
})

const expect = chai.expect

describe('ms-client in browser', () => {
  beforeEach(() => {
    clientFactorySpy = chai.spy(() => {})
  })

  it('returns a client from the client factory', () => {
    createClient()
    expect(clientFactorySpy).to.have.been.called()
  })
})
