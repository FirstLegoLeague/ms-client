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
