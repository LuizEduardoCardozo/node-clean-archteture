import bcrypt from 'bcrypt'

import BCryptAdapter from './bcrypt.adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  }
}))

describe('BCrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const sut = new BCryptAdapter(12)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 12)
  })

  test('should return a hash on success', async () => {
    const sut = new BCryptAdapter(12)
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
