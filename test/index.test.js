const chai = require('chai')
const spies = require('chai-spies')
const proxyquire = require('proxyquire')

chai.use(spies)

let correlationSpy
let independenceSpy

const { Client } = proxyquire('../', {
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
    Client()
    expect(correlationSpy).to.have.been.called()
  })

  it('client is not defaulty independent', () => {
    Client()
    expect(independenceSpy).to.not.have.been.called()
  })

  it('client is independent if requested to be', () => {
    Client({ independent: true })
    expect(independenceSpy).to.have.been.called()
  })
})
