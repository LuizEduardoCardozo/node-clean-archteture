import { DbAddAccount } from '../../data/usecases/db-add-account'
import BCryptAdapter from '../../infra/criptography/bcrypt.adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import SingUpController from '../../presentation/controllers/signup.controller'
import EmailValidatorAdapter from '../../utils/email-validator.adapter'
import env from '../config/env'

export default (): SingUpController => {
  const salt = env.SALT
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bCryptAdapter = new BCryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bCryptAdapter, addAccountRepository)
  return new SingUpController(emailValidatorAdapter, dbAddAccount)
}
