const MissingParamError = require('./missing-params')
const ServerError = require('./server-error')
const UnauthorizedError = require('./unauthorized-error')

module.exports = class httpResponse {
    static badRequest(paramName) {
        return {
            statusCode: 400,
            body: new MissingParamError(paramName)
        }
    }

    static serverError() {
        return {
            statusCode: 500,
            body: new ServerError()
        }
    }

    static unauthorizedError() {
        return {
            statusCode: 401,
            body: new UnauthorizedError()
        }
    }

    static ok(accessToken) {
        return {
            statusCode: 200,
            body: accessToken
        }
    }
}
