import User from '@modules/users/infra/typeorm/entities/User'
import { hash } from 'bcryptjs'
import { injectable, inject } from 'tsyringe'

import IUsersRepository from '../repositories/IUsersRepository'

import AppError from '@shared/errors/AppError'

interface IRequest {
  name: string
  email: string
  level: number
  password: string
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    name,
    email,
    level,
    password,
  }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email)

    if (checkUserExists) {
      throw new AppError('Email address already in use')
    }

    const hashedPassword = await hash(password, 8)

    const user = await this.usersRepository.create({
      name,
      email,
      level,
      password: hashedPassword,
    })

    return user
  }
}

export default CreateUserService
