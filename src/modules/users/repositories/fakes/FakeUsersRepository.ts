import User from '@modules/users/infra/typeorm/entities/User'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import { v4 as uuid } from 'uuid'

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
}

export default FakeUsersRepository
