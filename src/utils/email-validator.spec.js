const EmailValidator = require('./email-validator')
const validator = require('validator')

const makeSut = () => {
    return new EmailValidator()
}

describe('Email Validator', () => {
    test('Should return true if validator return true', () => {
        const sut = makeSut()
        const isEmailValid = sut.isValid('valid@gmail.com')

        expect(isEmailValid).toBe(true)
    })

    test('Should return false if validator return false', () => {
        validator.isEmailValid = false
        const sut = makeSut()
        const isEmailValid = sut.isValid('invalid@gmail.com')

        expect(isEmailValid).toBe(false)
    })

    test('Should call validator with correct email', () => {
        const sut = makeSut()
        sut.isValid('any@gmail.com')

        expect(validator.email).toBe('any@gmail.com')
    })
})