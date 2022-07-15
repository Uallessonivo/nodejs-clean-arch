const validator = require('validator')


class EmailValidator {
    isValid(email) {
        return validator.isEmail(email)
    }
}

describe('Email Validator', () => {
    test('Should return true if validator return true', () => {
        const sut = new EmailValidator();
        const isEmailValid = sut.isValid('valid@gmail.com')

        expect(isEmailValid).toBe(true)
    })

    test('Should return false if validator return false', () => {
        validator.isEmailValid = false
        const sut = new EmailValidator();
        const isEmailValid = sut.isValid('invalid@gmail.com')

        expect(isEmailValid).toBe(false)
    })
})