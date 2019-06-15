class LocalStorageNamespace {
  constructor (namespace, seperator = '_', storage) {
    this._namespace = namespace
    this._seperator = seperator
    this._storage = storage || window.localStorage
  }

  exists (key) {
    return Boolean(this._storage.getItem(this._fullKey(key)))
  }

  get (key) {
    return this._getValueOfFullKey(this._fullKey(key))
  }

  all () {
    return Object.keys(this._storage)
      .reduce((mapping, key) => {
        const [namespace, partialKey] = key.split(this._seperator)
        if (namespace === this._namespace && partialKey !== undefined) {
          mapping[partialKey] = this._getValueOfFullKey(key)
        }
        return mapping
      }, {})
  }

  set (key, value) {
    if (this.exists(key)) {
      throw new Error('Key exists')
    } else {
      this._storage.setItem(this._fullKey(key), JSON.stringify(value))
    }
  }

  delete (key) {
    this._storage.removeItem(this._fullKey(key))
  }

  clear () {
    Object.keys(this.all()).forEach(key => this.delete(key))
  }

  _fullKey (partialKey) {
    return `${this._namespace}${this._seperator}${partialKey}`
  }

  _getValueOfFullKey (fullKey) {
    const rawValue = this._storage.getItem(fullKey)
    try {
      return JSON.parse(rawValue)
    } catch (SyntaxError) {
      return rawValue
    }
  }
}

exports.LocalStorageNamespace = LocalStorageNamespace
