import User from '@modules/users/infra/typeorm/entities/User'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import { v4 as uuid } from 'uuid'
import IFilterUsersParamsDTO from '@modules/users/dtos/IFilterUsersParamsDTO'

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id)

    return findUser
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email)

    return findUser
  }

  public async findAll({
    ...params
  }: IFilterUsersParamsDTO): Promise<User[] | undefined> {
    if (Object.keys(params).length === 0) {
      return this.users
    } else {
      let filteredUsers: User[] = [...this.users]

      if (params.email) {
        filteredUsers = filteredUsers.filter(
          user => user.email === params.email,
        )
      }
      if (params.name) {
        filteredUsers = filteredUsers.filter(user => user.name === params.name)
      }
      if (params.level) {
        filteredUsers = filteredUsers.filter(
          user => user.level === params.level,
        )
      }
      if (params.id) {
        filteredUsers = filteredUsers.filter(user => user.id === params.id)
      }

      return filteredUsers
    }
  }

  public async create({
    name,
    email,
    level,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User()

    Object.assign(user, {
      id: uuid(),
      name,
      email,
      level,
      password,
    })

    this.users.push(user)

    return user
  }

  public async save(user: User): Promise<User> {
    const filteredUsers = this.users.filter(item => item.id !== user.id)

    filteredUsers.push(user)

    this.users = filteredUsers

    return user
  }

  public async delete(user: User): Promise<void> {
    const filteredUsers = this.users.filter(item => item.id !== user.id)

    this.users = filteredUsers
  }

  public async update(user: User): Promise<User> {
    const filteredUsers = this.users.filter(item => item.id !== user.id)

    filteredUsers.push(user)

    this.users = filteredUsers

    return user
  }
}

export default FakeUsersRepository
