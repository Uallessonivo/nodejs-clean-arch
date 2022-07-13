const httpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return httpResponse.serverError()
    }

    const { email, password } = httpRequest.body

    if (!email) {
      return httpResponse.badRequest('Email')
    }

    if (!password) {
      return httpResponse.badRequest('Password')
    }

    this.authUseCase.auth(email, password)

    return httpResponse.unauthorizedError()
  }
}
