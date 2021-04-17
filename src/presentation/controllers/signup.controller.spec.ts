import SingUpController from './signup.controller'
import InvalidParamError from '../errors/invalid-param.error'
import MissingParamError from '../errors/missing-params.error'
import { EmailValidator } from '../protocols/email-validator'
import ServerError from '../errors/server.error'
import { AccountModel, AddAccountModel } from '../../domain/models/account.model'
import { AddAccount } from '../../domain/usecases/add-account'

interface SutTypes {
  sut: SingUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const { name, email, password } = account
      return {
        id: 'valid_id',
        name,
        email,
        password
      }
    }
  }
  return new AddAccountStub()
}

const makeEmailValidatorSub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeEmailValidatorSubWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      throw new Error()
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorSub()
  const addAccountStub = makeAddAccountStub()
  const sut = new SingUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

const makeSutWithError = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorSubWithError()
  const addAccountStub = makeAddAccountStub()
  const sut = new SingUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('Signup Controller', () => {
  test('should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_mail@email.com',
        password: 'anypassword',
        passwordConfirmation: 'anypassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'anypassword',
        passwordConfirmation: 'anypassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@email.com',
        passwordConfirmation: 'anypassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@email.com',
        password: 'anotherpassword',
        passwordConfirmation: 'otherpassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('should return 400 if no password confirmation fails', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@email.com',
        password: 'anypassword'

      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isEmailValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'anypassword',
        passwordConfirmation: 'anypassword'
      }
    }
    sut.handle(httpRequest)
    expect(isEmailValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })

  test('should return 400 if and invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail',
        password: 'anypassword',
        passwordConfirmation: 'anypassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should return 500 if EmailValidator throws', () => {
    const { sut } = makeSutWithError()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail',
        password: 'anypassword',
        passwordConfirmation: 'anypassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should call addAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'anypassword',
        passwordConfirmation: 'anypassword'
      }
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'anypassword'
    })
  })

  test('should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSutWithError()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail',
        password: 'anypassword',
        passwordConfirmation: 'anypassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('should call 200 if valid data is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'anypassword',
        passwordConfirmation: 'anypassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toEqual(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'anypassword'
    })
  })
})
