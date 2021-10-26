import User from '@modules/users/infra/typeorm/entities/User'
import { Equal, getRepository, ILike, IsNull, Not, Repository } from 'typeorm'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import IFilterUsersParamsDTO from '@modules/users/dtos/IFilterUsersParamsDTO'

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>

  constructor() {
    this.ormRepository = getRepository(User)
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: { id },
    })

    return findUser
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({ where: { email } })

    return findUser
  }

  public async findAll(
    params: IFilterUsersParamsDTO,
  ): Promise<User[] | undefined> {
    if (Object.keys(params).length === 0) {
      const users = await this.ormRepository.find({
        order: {
          name: 'DESC',
        },
      })
      return users
    } else {
      const users = await this.ormRepository.find({
        name: params.name
          ? params.name && ILike(`%${params.name}%`)
          : Not(IsNull()),
        email: params.email
          ? params.email && Equal(params.email)
          : Not(IsNull()),
        level: params.level
          ? params.level && Equal(params.level)
          : Not(IsNull()),
        id: params.id ? params.id && Equal(params.id) : Not(IsNull()),
      })

      return users
    }
  }

  public async create({
    name,
    email,
    level,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      email,
      level,
      password,
    })

    await this.ormRepository.save(user)

    return user
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user)
  }

  public async delete(user: User): Promise<void> {
    await this.ormRepository.delete(user)
  }

  public async update(user: User): Promise<User> {
    return await this.ormRepository.save(user)
  }
}

export default UsersRepository
