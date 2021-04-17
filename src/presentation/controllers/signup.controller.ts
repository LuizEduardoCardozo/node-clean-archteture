import { HttpRequest, HttpResponse } from '../protocols/http'
import { Controller } from '../protocols/controller'
import { badRequest, serverError } from '../helpers/http.helper'
import { EmailValidator } from '../protocols/email-validator'
import MissingParamError from '../errors/missing-params.error'
import InvalidParamError from '../errors/invalid-param.error'
import ServerError from '../errors/server.error'

export default class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (httpRequest.body[field] === undefined) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password, passwordConfirmation } = httpRequest.body
      const emailNotValid = !this.emailValidator.isValid(email)
      if (emailNotValid) {
        return badRequest(new InvalidParamError('email'))
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      return {
        statusCode: 200,
        body: {}
      }
    } catch (e) {
      return serverError(new ServerError())
    }
  }
}
