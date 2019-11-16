const chai = require('chai')
const spies = require('chai-spies')
const proxyquire = require('proxyquire')

chai.use(spies)

let independenceSpy
let clientIdentitySpy

global.window = global.window || { }
window.localStorage = global.localStorage

const { createClient } = proxyquire('../../lib/client_factory', {
  './independence': {
    makeIndependent: function () {
      independenceSpy.apply(this, arguments)
    }
  },
  './client_identity': {
    identifyClient: function () {
      clientIdentitySpy.apply(this, arguments)
    }
  }
})

const expect = chai.expect

describe('Client factory', () => {
  beforeEach(() => {
    independenceSpy = chai.spy(() => {})
    clientIdentitySpy = chai.spy(() => {})
  })

  it('returns a client which is identified', () => {
    createClient()
    expect(clientIdentitySpy).to.have.been.called()
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
