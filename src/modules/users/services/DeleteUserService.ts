import { injectable, inject } from 'tsyringe'

import IUsersRepository from '../repositories/IUsersRepository'

import AppError from '@shared/errors/AppError'

interface IRequest {
  id: string
  adminId: string
}

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id, adminId }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(id)
    const admin = await this.usersRepository.findById(adminId)

    if (!user) {
      throw new AppError('User not found')
    }

    if (!admin) {
      throw new AppError('Admin not found')
    }

    if (admin.level !== 1) {
      throw new AppError('User has no privilege to delete')
    }

    const deletedUser = {
      ...user,
      deleted: true,
      deleted_by: admin.id,
      deleted_date: new Date(),
    }

    await this.usersRepository.update(deletedUser)
  }
}

export default DeleteUserService
