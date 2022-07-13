const httpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
    constructor(authUseCase) {
        this.authUseCase = authUseCase
    }

    async route(httpRequest) {
        try {
            const { email, password } = httpRequest.body

            if (!email) {
                return httpResponse.badRequest('Email')
            }

            if (!password) {
                return httpResponse.badRequest('Password')
            }

            const accessToken = await this.authUseCase.auth(email, password)

            if (!accessToken) {
                return httpResponse.unauthorizedError()
            }

            return httpResponse.ok({ accessToken })
        } catch (error) {
            return httpResponse.serverError()
        }
    }
}
