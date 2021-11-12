import Account from '@modules/accounts/infra/typeorm/entities/Account'
import { injectable, inject } from 'tsyringe'

import IAccountsRepository from '../repositories/IAccountsRepository'

import AppError from '@shared/errors/AppError'
import IFilterAccountsParamsDTO from '../dtos/IFilterAccountsParamsDTO'

@injectable()
class ListAccountsService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,
  ) {}

  public async execute(params?: IFilterAccountsParamsDTO): Promise<Account[]> {
    let accounts
    if (params) {
      accounts = await this.accountsRepository.findAll(params)
    } else {
      accounts = await this.accountsRepository.findAll()
    }

    if (!accounts) {
      throw new AppError('Could not load accounts list')
    }

    return accounts
  }
}

export default ListAccountsService
