import { HttpRequest, HttpResponse } from '../protocols/http'
import { Controller } from '../protocols/controller'
import { badRequest } from '../helpers/http.helper'
import { EmailValidator } from '../protocols/email-validator'
import MissingParamError from '../errors/missing-params.error'
import InvalidParamError from '../errors/invalid-param.error'

export default class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (httpRequest.body[field] === undefined) {
        return badRequest(new MissingParamError(field))
      }
    }
    const emailNotValid = !this.emailValidator.isValid(httpRequest.body.email)
    if (emailNotValid) {
      return badRequest(new InvalidParamError('email'))
    }
    return {
      statusCode: 200,
      body: {}
    }
  }
}
