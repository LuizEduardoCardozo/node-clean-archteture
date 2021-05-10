import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account MongoDb Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(`${process.env.MONGO_URL ?? ''}`)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account if create succeed', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'valid_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_mail@mail.com')
    expect(account.password).toBe('valid_password')
  })
})
