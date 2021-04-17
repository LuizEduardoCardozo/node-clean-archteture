export default class InvalidParamError extends Error {
  constructor (param: string) {
    super(`Invalid parameter: ${param}`)
    this.name = param
  }
}
