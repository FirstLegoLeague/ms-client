const { LocalStorageNamespace } = require('./local_storage_namespace')

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
    IndependentRequest.storage.put(this.key, this.data)
  }

  delete () {
    IndependentRequest.storage.delete(this.key)
  }
}

IndependentRequest.storage = new LocalStorageNamespace('independentRequests')

IndependentRequest.all = () => {
  return Object.entries(IndependentRequest.storage.all())
    .map(([key, config]) => new IndependentRequest(config, key))
}

exports.IndependentRequest = IndependentRequest
