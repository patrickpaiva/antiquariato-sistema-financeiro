import { injectable, inject } from 'tsyringe'

import IAccountsRepository from '../repositories/IAccountsRepository'

import AppError from '@shared/errors/AppError'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'

interface IRequest {
  id: string
  adminId: string
}

@injectable()
class DeleteAccountService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id, adminId }: IRequest): Promise<void> {
    const account = await this.accountsRepository.findById(id)
    const admin = await this.usersRepository.findById(adminId)

    if (!account) {
      throw new AppError('Account not found', 404)
    }

    if (!admin) {
      throw new AppError('Admin not found', 404)
    }

    if (admin.level !== 1) {
      throw new AppError('User has no privilege to delete', 403)
    }

    const deletedAccount = {
      ...account,
      deleted: true,
      deleted_by: admin.id,
      deleted_date: new Date(),
    }

    await this.accountsRepository.update(deletedAccount)
  }
}

export default DeleteAccountService
