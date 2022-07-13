import httpResponse from '../helpers/http-response'

export default class LoginRouter {
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
  }
}
