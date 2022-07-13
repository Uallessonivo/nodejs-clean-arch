import MissingParamError from '../helpers/missing-params'
import LoginRouter from './login-router'

const makeSut = () => {
  return new LoginRouter()
}

describe('Login Router', () => {
  test('Should return 400 if no email is provied', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        password: 'password'
      }
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('Email'))
  })

  test('Should return 400 if no password is provied', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        email: 'email@gmail.com'
      }
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('Password'))
  })

  test('Should return 500 if no httpRequest is provided', () => {
    const sut = makeSut()

    const httpResponse = sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if httpRequest has no body', () => {
    const sut = makeSut()

    const httpRequest = {}

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })
})
