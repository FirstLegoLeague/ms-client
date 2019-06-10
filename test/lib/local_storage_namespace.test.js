const chai = require('chai')

const { LocalStorageNamespace } = require('../../lib/local_storage_namespace')

const expect = chai.expect
const STORAGE_PREFIX = 'prefix'

global.window = global.window || { }
window.localStorage = global.localStorage

describe('local storage namespace', () => {
  let storage

  beforeEach(() => {
    storage = new LocalStorageNamespace(STORAGE_PREFIX)
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('exists returns true if the key exists', () => {
    const key = 'key'
    const value = 'value'
    storage.set(key, value)
    expect(storage.exists(key)).to.equal(true)
  })

  it('exists returns false if the key does not exist', () => {
    const key = 'key'
    expect(storage.exists(key)).to.equal(false)
  })

  it('get returns the parsed object if it exists', () => {
    const key = 'key'
    const value = { field: 'value', integer: 1, boolean: true }
    storage.set(key, value)
    expect(storage.get(key)).to.eql(value)
  })

  it('get returns undefined if it does not exists', () => {
    const key = 'key'
    expect(storage.get(key)).to.equal(undefined)
  })

  it('all returns all the keys and values set', () => {
    const all = {
      key1: 'value1',
      key2: { field1: 'value1', field2: 1000 },
      key3: 301,
      key4: true
    }
    Object.entries(all).forEach(([key, value]) => storage.set(key, value))
    expect(storage.all()).to.eql(all)
  })

  it('set saves the key with the prefix in the local storage', () => {
    const key = 'key'
    const value = 'value'
    storage.set(key, value)
    expect(window.localStorage[`${STORAGE_PREFIX}_${key}`]).to.equal(JSON.stringify(value))
  })

  it('set throws error if the key is already set', () => {
    const key = 'key'
    storage.set(key, 'value')
    expect(() => storage.set(key, 'another value')).to.throw()
  })

  it('delete removes the key from the localstorage', () => {
    const key = 'key'
    const value = 'value'
    storage.set(key, value)
    expect(window.localStorage[`${STORAGE_PREFIX}_${key}`]).to.equal(JSON.stringify(value))
    storage.delete(key)
    expect(window.localStorage[`${STORAGE_PREFIX}_${key}`]).to.equal(undefined)
  })

  it('clear removes all namespace keys from the localstorage', () => {
    const all = {
      key1: 'value1',
      key2: { field1: 'value1', field2: 1000 },
      key3: 301,
      key4: true
    }
    Object.entries(all).forEach(([key, value]) => storage.set(key, value))
    storage.clear()
    expect(Object.keys(storage.all()).length).to.equal(0)
    expect(Object.keys(window.localStorage).filter(key => key.startWith(STORAGE_PREFIX)).length).to.equal(0)
  })
})
