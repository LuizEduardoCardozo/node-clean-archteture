import { AccountModel, AddAccountModel } from '../../domain/models/account.model'

export default interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
