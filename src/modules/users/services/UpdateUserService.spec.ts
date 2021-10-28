import AppError from '@shared/errors/AppError'
import User from '../infra/typeorm/entities/User'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import CreateUserService from './CreateUserService'
import ListUsersService from './ListUsersService'
import UpdateUserService from './UpdateUserService'

let fakeUsersRepository: FakeUsersRepository
let createUser: CreateUserService
let findUsers: ListUsersService
let updateUser: UpdateUserService
let adminUser: User

describe('UpdateUser', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()

    createUser = new CreateUserService(fakeUsersRepository)
    findUsers = new ListUsersService(fakeUsersRepository)
    updateUser = new UpdateUserService(fakeUsersRepository)

    const newUser = {
      name: 'Patrick',
      email: 'teste@teste.com',
      level: 1,
      password: '123456',
    }

    adminUser = await createUser.execute(newUser)
  })
  it('should be able to update an User', async () => {
    const user = {
      name: 'Caio Paulista',
      email: 'teste2@teste.com',
      level: 1,
      password: '123456',
    }

    await createUser.execute(user)

    const findUser = await findUsers.execute({ email: user.email })

    await updateUser.execute({
      id: findUser[0].id,
      adminId: adminUser.id,
      name: 'John Kennedy',
    })

    const users = await findUsers.execute({ id: findUser[0].id })

    expect(users).toHaveLength(1)
    expect(users[0].name).toBe('John Kennedy')
  })

  it('should not be able to update an User without admin access', async () => {
    const user = {
      name: 'Caio Paulista',
      email: 'teste2@teste.com',
      level: 1,
      password: '123456',
    }

    await createUser.execute(user)

    const user2 = {
      name: 'Caio Paulista',
      email: 'teste3@teste.com',
      level: 2,
      password: '123456',
    }

    const notAdminUser = await createUser.execute(user2)

    const findUser = await findUsers.execute({ email: user.email })

    await expect(
      updateUser.execute({
        id: findUser[0].id,
        adminId: notAdminUser.id,
        name: 'John Kennedy',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to update an invalid User', async () => {
    await expect(
      updateUser.execute({
        id: 'uahsduahduisad',
        adminId: adminUser.id,
        name: 'John Kennedy',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to update an User with invalid credential', async () => {
    const user = {
      name: 'Caio Paulista',
      email: 'teste2@teste.com',
      level: 1,
      password: '123456',
    }

    const userToUpdate = await createUser.execute(user)

    await expect(
      updateUser.execute({
        id: userToUpdate.id,
        adminId: 'uhdaushduadha',
        name: 'John Kennedy',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to update an Users email if that email is already in use', async () => {
    const user = {
      name: 'Caio Paulista',
      email: 'teste2@teste.com',
      level: 1,
      password: '123456',
    }

    await createUser.execute(user)

    const user2 = {
      name: 'Caio Paulista',
      email: 'teste3@teste.com',
      level: 1,
      password: '123456',
    }

    await createUser.execute(user2)

    const findUser = await findUsers.execute({ email: user.email })

    await expect(
      updateUser.execute({
        id: findUser[0].id,
        adminId: adminUser.id,
        email: user2.email,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
