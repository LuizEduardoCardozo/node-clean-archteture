import { AccountModel, AddAccountModel } from '../../domain/models/account.model'
import { AddAccount } from '../../domain/usecases/add-account'
import AddAccountRepository from '../protocols/add-account-repository'
import Encrypter from '../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: any) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (account: AddAccountModel): Promise<AccountModel|any> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    const createdAccount = await this.addAccountRepository.add(Object.assign(account, {
      password: hashedPassword
    }))
    return createdAccount
  }
}
