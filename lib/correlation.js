const { getCorrelationId } = require('@first-lego-league/ms-correlation')
const { Axios } = require('axios')

Axios.prototype.correlated = function () {
  this.interceptors.request.use(request => {
    request.headers['correlation-id'] = getCorrelationId()
    return request
  })
}
