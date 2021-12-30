import IAccountsRepository from '@modules/accounts/repositories/IAccountsRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { validate } from 'uuid'
import Account from '../infra/typeorm/entities/Account'

interface IRequest {
  id: string
  bank_number: number
  agency_number: number
  account_number: number
  account_type: number
  bank_name: string
  adminId: string
}

@injectable()
class UpdateAccountService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id, adminId, ...params }: IRequest): Promise<Account> {
    if (validate(id) === false) {
      throw new AppError('Invalid id, please check your request')
    }
    const findAdmin = await this.usersRepository.findById(adminId)
    const findAccount = await this.accountsRepository.findById(id)

    if (!findAdmin) {
      throw new AppError('Invalid admin Id', 404)
    }

    if (findAdmin.level !== 1) {
      throw new AppError('Need admin access to update', 404)
    }

    if (!findAccount) {
      throw new AppError('Account not found', 404)
    }

    const alreadyExists = await this.accountsRepository.findAll({
      bank_number: params.bank_number,
      agency_number: params.agency_number,
      account_number: params.account_number,
    })

    if (alreadyExists && alreadyExists[0].id !== id) {
      throw new AppError('There is another account with same data', 409)
    }

    const updatedAccount = {
      ...findAccount,
      ...params,
      last_update_date: new Date(),
      last_update_by: adminId,
    }

    return this.accountsRepository.update(updatedAccount)
  }
}

export default UpdateAccountService
