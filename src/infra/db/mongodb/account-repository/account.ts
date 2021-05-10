import AddAccountRepository from '../../../../data/protocols/add-account-repository'
import { AccountModel, AddAccountModel } from '../../../../domain/models/account.model'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const insertedAccount = await accountCollection.insertOne(accountData)
    return MongoHelper.map(insertedAccount.ops[0])
  }
}
