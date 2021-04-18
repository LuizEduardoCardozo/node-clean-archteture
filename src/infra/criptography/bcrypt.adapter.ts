import bcrypt from 'bcrypt'

import Encrypter from '../../data/protocols/encrypter'

export default class BCryptAdapter implements Encrypter {
  private readonly salt: number

  constructor (salt: number = 12) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}
