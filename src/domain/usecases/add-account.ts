import { AccountModel, AddAccountModel } from '../models/account.model'

export interface AddAccount {
  add: (account: AddAccountModel) => AccountModel
}
