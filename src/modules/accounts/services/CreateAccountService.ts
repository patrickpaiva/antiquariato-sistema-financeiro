import Account from '@modules/accounts/infra/typeorm/entities/Account'
import { injectable, inject } from 'tsyringe'

import IAccountsRepository from '../repositories/IAccountsRepository'

import AppError from '@shared/errors/AppError'
import ICreateAccountDTO from '../dtos/ICreateAccountDTO'

@injectable()
class CreateAccountService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,
  ) {}

  public async execute({
    bank_number,
    agency_number,
    account_number,
    account_type,
    bank_name,
  }: ICreateAccountDTO): Promise<Account> {
    const checkAccountExists = await this.accountsRepository.findAll({
      bank_number,
      agency_number,
      account_number,
    })

    if (checkAccountExists && checkAccountExists[0]) {
      throw new AppError('Account already registered')
    }

    const account = await this.accountsRepository.create({
      bank_number,
      agency_number,
      account_number,
      account_type,
      bank_name,
    })

    return account
  }
}

export default CreateAccountService
