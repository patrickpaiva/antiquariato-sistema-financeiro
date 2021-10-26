import User from '@modules/users/infra/typeorm/entities/User'
import { injectable, inject } from 'tsyringe'

import IUsersRepository from '../repositories/IUsersRepository'

import AppError from '@shared/errors/AppError'
import IFilterUsersParamsDTO from '../dtos/IFilterUsersParamsDTO'

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(params?: IFilterUsersParamsDTO): Promise<User[]> {
    let users
    if (params) {
      users = await this.usersRepository.findAll(params)
    } else {
      users = await this.usersRepository.findAll()
    }

    if (!users) {
      throw new AppError('Could not load users list')
    }

    return users
  }
}

export default ListUsersService
