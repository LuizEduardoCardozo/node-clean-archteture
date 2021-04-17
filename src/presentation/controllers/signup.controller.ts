import { HttpRequest, HttpResponse } from '../protocols/http'
import { Controller } from '../protocols/controller'
import { badRequest, serverError, success } from '../helpers/http.helper'
import { EmailValidator } from '../protocols/email-validator'
import MissingParamError from '../errors/missing-params.error'
import InvalidParamError from '../errors/invalid-param.error'
import ServerError from '../errors/server.error'
import { AddAccount } from '../../domain/usecases/add-account'

export default class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (httpRequest.body[field] === undefined) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, name, password, passwordConfirmation } = httpRequest.body
      const emailNotValid = !this.emailValidator.isValid(email)
      if (emailNotValid) {
        return badRequest(new InvalidParamError('email'))
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const createdAccount = await this.addAccount.add({
        email,
        name,
        password
      })
      return success(createdAccount)
    } catch (e) {
      return serverError(new ServerError())
    }
  }
}
