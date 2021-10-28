import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { validate } from 'uuid'
import User from '../infra/typeorm/entities/User'

interface IRequest {
  id: string
  email: string
  name: string
  password: string
  adminId: string
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id, adminId, ...params }: IRequest): Promise<User> {
    if (validate(id) === false) {
      throw new AppError('Invalid id, please check your request')
    }
    const findAdmin = await this.usersRepository.findById(adminId)
    const findUser = await this.usersRepository.findById(id)

    if (!findAdmin) {
      throw new AppError('Invalid admin Id', 404)
    }

    if (findAdmin.level !== 1) {
      throw new AppError('Need admin access to update', 404)
    }

    if (!findUser) {
      throw new AppError('User not found', 404)
    }

    if (params.email) {
      const findByEmail = await this.usersRepository.findByEmail(params.email)

      if (findByEmail && findByEmail.id !== findUser.id) {
        throw new AppError('Email already in use', 409)
      }
    }

    const updatedUser = {
      ...findUser,
      ...params,
      last_update_date: new Date(),
      last_update_by: adminId,
    }

    return this.usersRepository.update(updatedUser)
  }
}

export default UpdateUserService
