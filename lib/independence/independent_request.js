class IndependentRequest {
  constructor (config) {
    Object.assign(this, config)
    this.key = this.key || Date.now()

    if (this.storage === undefined) {
      throw new Error('Missing storage')
    }
  }

  send (adapter) {
    this.data.pending = true
    return adapter(this.data)
      .then(response => {
        if (response.status <= 0) {
          throw response
        }
        return response
      })
      .catch(err => {
        if (err.status <= 0) {
          this.data.pending = false
          this.save()
          throw err
        }
      })
      .then(response => {
        this.delete()
        return response
      })
  }

  save () {
    this.storage.put(this.key, this.data)
  }

  delete () {
    this.storage.delete(this.key)
  }

  static all (storage) {
    if (storage === undefined) {
      throw new Error('Missing storage')
    }

    return Object.entries(storage.all())
      .map(([key, data]) => new IndependentRequest({ data, key, storage }))
  }
}

exports.IndependentRequest = IndependentRequest
