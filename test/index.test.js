const chai = require('chai')
const spies = require('chai-spies')
const proxyquire = require('proxyquire')

chai.use(spies)

let correlationSpy
let independenceSpy

global.window = global.window || { }
window.localStorage = global.localStorage

const { createClient } = proxyquire('../', {
  './lib/correlation': {
    correlate: function () {
      correlationSpy.apply(this, arguments)
    }
  },
  './lib/independence': {
    makeIndependent: function () {
      independenceSpy.apply(this, arguments)
    }
  }
})

const expect = chai.expect

describe('ms-client', () => {
  beforeEach(() => {
    correlationSpy = chai.spy(() => {})
    independenceSpy = chai.spy(() => {})
  })

  it('client is defaultly correlated', () => {
    createClient()
    expect(correlationSpy).to.have.been.called()
  })

  it('client is not defaulty independent', () => {
    createClient()
    expect(independenceSpy).to.not.have.been.called()
  })

  it('client is independent if requested to be', () => {
    createClient({ independent: true })
    expect(independenceSpy).to.have.been.called()
  })
})
