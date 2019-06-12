const { LocalStorageNamespace } = require('./local_storage_namespace')

const storage = new LocalStorageNamespace('independenceActions')

class IndependentRequest {
  constructor (data, key) {
    this.data = data
    this.key = key || Date.now()
  }

  send (adapter) {
    this.data.pending = true
    this.save()
    return adapter(this.data)
      .then(response => {
        if (response.status <= 0) {
          throw response
        }
        this.delete()
        return response
      })
      .catch(err => {
        if (err.status > 0 && err.status < 500) {
          this.delete()
        } else {
          this.data.pending = false
          this.save()
        }
        throw err
      })
  }

  save () {
    storage.put(this.key, this.data)
  }

  delete () {
    storage.delete(this.key)
  }
}

IndependentRequest.all = () => {
  return Object.entries(storage.all())
    .map(([key, config]) => new IndependentRequest(config, key))
}

exports.IndependentRequest = IndependentRequest