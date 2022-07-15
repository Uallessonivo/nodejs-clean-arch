const { MissingParamError } = require("../../utils/errors")

class AuthUseCase {
    async auth(email, password) {
        if (!email) {
            throw new MissingParamError('Email')
        }

        if (!password) {
            throw new MissingParamError('Password')
        }
    }
}

describe('Auth UseCase', () => {
    test('Should throw if no email is provided', async () => {
        const sut = new AuthUseCase()
        const promise = sut.auth()

        expect(promise).rejects.toThrow(new MissingParamError('Email'))
    })

    test('Should throw if no password is provided', async () => {
        const sut = new AuthUseCase()
        const promise = sut.auth('any@gmail.com')

        expect(promise).rejects.toThrow(new MissingParamError('Password'))
    })
})