class LocalStorageNamespace {
  constructor (namespace, seperator = '_') {
    this._namespace = namespace
    this._seperator = seperator
  }

  exists (key) {
    return window.localStorage[this._fullKey(key)] !== undefined
  }

  get (key) {
    return this._getValueOfFullKey(this._fullKey(key))
  }

  all () {
    return Object.keys(window.localStorage)
      .filter(key => key.split(this._seperator)[0] === this._namespace)
      .reduce((mapping, key) => {
        return Object.assign(mapping, { [this._partialKey(key)]: this._getValueOfFullKey(key) })
      }, {})
  }

  set (key, value) {
    if (this.exists(key)) {
      throw new Error('Key exists')
    } else {
      window.localStorage[this._fullKey(key)] = JSON.stringify(value)
    }
  }

  delete (key) {
    delete window.localStorage[this._fullKey(key)]
  }

  clear () {
    Object.keys(this.all()).forEach(key => this.delete(key))
  }

  _partialKey (fullKey) {
    return fullKey.replace(new RegExp(`^${this._namespace}${this._seperator}`), '')
  }

  _fullKey (partialKey) {
    return `${this._namespace}${this._seperator}${partialKey}`
  }

  _getValueOfFullKey (fullKey) {
    const rawValue = window.localStorage[fullKey]
    try {
      return JSON.parse(rawValue)
    } catch (SyntaxError) {
      return rawValue
    }
  }
}

exports.LocalStorageNamespace = LocalStorageNamespace
