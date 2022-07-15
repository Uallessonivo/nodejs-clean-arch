const LoginRouter = require('./login-router')
const { UnauthorizedError, ServerError } = require('../errors')
const { InvalidParamError, MissingParamError } = require('../../utils/errors')

const makeSut = () => {
    const authUseCaseSpy = makeAuthUseCase()
    const emailValidatorSpy = makeEmailValidator()
    authUseCaseSpy.accessToken = 'valid'
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

    return {
        sut,
        authUseCaseSpy,
        emailValidatorSpy
    }
}

const makeEmailValidator = () => {
    class EmailValidatorSpy {
        isValid(email) {
            this.email = email
            return this.isEmailValid
        }
    }

    const emailValidatorSpy = new EmailValidatorSpy()
    emailValidatorSpy.isEmailValid = true
    return emailValidatorSpy
}

const makeEmailValidatorWithError = () => {
    class EmailValidatorSpy {
        isValid() {
            throw new Error()
        }
    }

    return new EmailValidatorSpy()
}

const makeAuthUseCase = () => {
    class AuthUseCaseSpy {
        async auth(email, password) {
            this.email = email
            this.password = password
            return this.accessToken
        }
    }

    const authUseCaseSpy = new AuthUseCaseSpy()
    authUseCaseSpy.accessToken = 'valid'
    return authUseCaseSpy
}

const makeAuthUseCaseWithError = () => {
    class AuthUseCaseSpy {
        async auth() {
            throw new Error()
        }
    }

    return new AuthUseCaseSpy()
}

describe('Login Router', () => {
    test('Should return 400 if no email is provied', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                password: 'password'
            }
        }

        const httpResponse = await sut.route(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('Email'))
    })

    test('Should return 400 if no password is provied', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                email: 'email@gmail.com'
            }
        }

        const httpResponse = await sut.route(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('Password'))
    })

    test('Should return 500 if no httpRequest is provided', async () => {
        const { sut } = makeSut()

        const httpResponse = await sut.route()

        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 500 if httpRequest has no body', async () => {
        const { sut } = makeSut()

        const httpRequest = {}

        const httpResponse = await sut.route(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should call authUseCaseSpy with correct params', async () => {
        const { authUseCaseSpy, sut } = makeSut()

        const httpRequest = {
            body: {
                email: 'email@gmail.com',
                password: 'password'
            }
        }

        await sut.route(httpRequest)

        expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
        expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
    })

    test('Should return 401 when invalid credentuals are provided', async () => {
        const { sut, authUseCaseSpy } = makeSut()

        authUseCaseSpy.accessToken = null

        const httpRequest = {
            body: {
                email: 'invalid_email@gmail.com',
                password: 'invalid_password'
            }
        }

        const httpResponse = await sut.route(httpRequest)

        expect(httpResponse.statusCode).toBe(401)
        expect(httpResponse.body).toEqual(new UnauthorizedError())
    })

    test('Should return 500 if no AuthUseCase is provided', async () => {
        const sut = new LoginRouter()

        const httpRequest = {
            body: {
                email: 'email@gmail.com',
                password: 'password'
            }
        }

        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 500 if no AuthUseCase has no auth method', async () => {
        class AuthUseCaseSpy { }

        const authUseCaseSpy = new AuthUseCaseSpy()

        const sut = new LoginRouter(authUseCaseSpy)

        const httpRequest = {
            body: {
                email: 'email@gmail.com',
                password: 'password'
            }
        }

        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 200 when valid credentials are provided', async () => {
        const { sut, authUseCaseSpy } = makeSut()

        const httpRequest = {
            body: {
                email: 'invalid_email@gmail.com',
                password: 'invalid_password'
            }
        }

        const httpResponse = await sut.route(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
    })

    test('Should return 500 if AuthUseCase throws', async () => {
        const authUseCaseSpy = makeAuthUseCaseWithError()
        authUseCaseSpy.accessToken = 'valid'
        const sut = new LoginRouter(authUseCaseSpy)

        const httpRequest = {
            body: {
                email: 'email@gmail.com',
                password: 'password'
            }
        }

        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
    })

    test('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorSpy } = makeSut()
        emailValidatorSpy.isEmailValid = false

        const httpRequest = {
            body: {
                email: 'invalid_email',
                password: 'password'
            }
        }

        const httpResponse = await sut.route(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('Email'))
    })

    test('Should return 500 if no EmailValidator is provided', async () => {
        const authUseCaseSpy = makeAuthUseCase()
        const sut = new LoginRouter(authUseCaseSpy)

        const httpRequest = {
            body: {
                email: 'email@gmail.com',
                password: 'password'
            }
        }

        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 500 if EmailValidator has no isValid method', async () => {
        const authUseCaseSpy = makeAuthUseCase()
        const sut = new LoginRouter(authUseCaseSpy, {})

        const httpRequest = {
            body: {
                email: 'email@gmail.com',
                password: 'password'
            }
        }

        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 500 if EmailValidator throws', async () => {
        const authUseCaseSpy = makeAuthUseCase()
        const emailValidatorSpy = makeEmailValidatorWithError()
        const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

        const httpRequest = {
            body: {
                email: 'email@gmail.com',
                password: 'password'
            }
        }

        const httpResponse = await sut.route(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
    })

    test('Should call EmailValidator with correct email', async () => {
        const { emailValidatorSpy, sut } = makeSut()

        const httpRequest = {
            body: {
                email: 'email@gmail.com',
                password: 'password'
            }
        }

        await sut.route(httpRequest)
        expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
    })
})
