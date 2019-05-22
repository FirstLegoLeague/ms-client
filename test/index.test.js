
const chai = require('chai')
const moxios = require('moxios')
const Promise = require('bluebird')

const { client } = require('../')

const expect = chai.expect

Promise.promisifyAll(moxios)

const URL = 'http://url'
const DATA = { param1: 'value1' }

const DATA_METHODS = ['post', 'put']

describe('ms-client', () => {
  beforeEach(() => moxios.install(client))
  afterEach(() => moxios.uninstall())

  ;['get', 'post', 'put', 'delete'].forEach(testedMethod => {
    describe(`${testedMethod.toUpperCase()} request`, () => {
      if (DATA_METHODS.includes(testedMethod)) {
        beforeEach(() => {
          client[testedMethod](URL, DATA)
        })

        it('creates request with given data in JSON format', () => {
          return moxios.waitAsync()
            .then(() => moxios.requests.mostRecent())
            .tap(request => request.respondWith({ status: 200 }))
            .then(request => {
              expect(request.config.data).to.equals(JSON.stringify(DATA))
            })
        })
      } else {
        beforeEach(() => {
          client[testedMethod](URL)
        })
      }

      it('creates request with correct method', () => {
        return moxios.waitAsync()
          .then(() => moxios.requests.mostRecent())
          .tap(request => request.respondWith({ status: 200 }))
          .then(request => {
            expect(request.config.method).to.equals(testedMethod)
          })
      })

      it('creates request with given URL', () => {
        return moxios.waitAsync()
          .then(() => moxios.requests.mostRecent())
          .tap(request => request.respondWith({ status: 200 }))
          .then(request => {
            expect(request.config.url).to.equals(URL)
          })
      })

      it('adds a correlation-id to the request', () => {
        return moxios.waitAsync()
          .then(() => moxios.requests.mostRecent())
          .tap(request => request.respondWith({ status: 200 }))
          .then(request => {
            expect(Object.keys(request.config.headers)).to.include('correlation-id')
          })
      })
    })
  })
})
