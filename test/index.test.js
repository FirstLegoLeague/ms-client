/* eslint promise/no-callback-in-promise: 0 */

const chai = require('chai')
const moxios = require('moxios')

const { client } = require('../')

const expect = chai.expect

const URL = 'http://url'
const DATA = { param1: 'value1' }

describe('ms-client', () => {
  beforeEach(() => moxios.install(client))
  afterEach(() => moxios.uninstall())

  describe('get request', () => {
    beforeEach(() => {
      client.get(URL)
    })

    it('calls axios get', done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        return request.respondWith({ status: 200 })
          .then(() => {
            expect(request.config.method).to.equals('get')
            expect(request.config.url).to.equals(URL)
            done()
          })
      })
    })

    it('adds a correlation-id to the request', done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        return request.respondWith({ status: 200 })
          .then(() => {
            expect(Object.keys(request.config.headers)).to.include('correlation-id')
            done()
          })
      })
    })
  })

  describe('post request', () => {
    beforeEach(() => {
      client.post(URL, DATA)
    })

    it('calls axios post', done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        return request.respondWith({ status: 200 })
          .then(() => {
            expect(request.config.method).to.equals('post')
            expect(request.config.url).to.equals(URL)
            expect(request.config.data).to.equals(JSON.stringify(DATA))
            done()
          })
      })
    })

    it('adds a correlation-id to the request', done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        return request.respondWith({ status: 200 })
          .then(() => {
            expect(Object.keys(request.config.headers)).to.include('correlation-id')
            done()
          })
      })
    })
  })

  describe('put request', () => {
    beforeEach(() => {
      client.put(URL, DATA)
    })

    it('calls axios put', done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        return request.respondWith({ status: 200 })
          .then(() => {
            expect(request.config.method).to.equals('put')
            expect(request.config.url).to.equals(URL)
            expect(request.config.data).to.equals(JSON.stringify(DATA))
            done()
          })
      })
    })

    it('adds a correlation-id to the request', done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        return request.respondWith({ status: 200 })
          .then(() => {
            expect(Object.keys(request.config.headers)).to.include('correlation-id')
            done()
          })
      })
    })
  })

  describe('delete request', () => {
    beforeEach(() => {
      client.delete(URL, DATA)
    })

    it('calls axios delete', done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        return request.respondWith({ status: 200 })
          .then(() => {
            expect(request.config.method).to.equals('delete')
            expect(request.config.url).to.equals(URL)
            done()
          })
      })
    })

    it('adds a correlation-id to the request', done => {
      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        return request.respondWith({ status: 200 })
          .then(() => {
            expect(Object.keys(request.config.headers)).to.include('correlation-id')
            done()
          })
      })
    })
  })
})
