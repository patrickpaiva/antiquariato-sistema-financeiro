import AppError from '@shared/errors/AppError'
import User from '../infra/typeorm/entities/User'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import CreateUserService from './CreateUserService'
import DeleteUserService from './DeleteUserService'
import ListUsersService from './ListUsersService'

let fakeUsersRepository: FakeUsersRepository
let createUser: CreateUserService
let deleteUser: DeleteUserService
let findUsers: ListUsersService
let adminUser: User

describe('DeleteUser', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()

    createUser = new CreateUserService(fakeUsersRepository)
    deleteUser = new DeleteUserService(fakeUsersRepository)
    findUsers = new ListUsersService(fakeUsersRepository)

    const newUser = {
      name: 'Patrick',
      email: 'teste@teste.com',
      level: 1,
      password: '123456',
    }

    adminUser = await createUser.execute(newUser)
  })
  it('should be able to delete an User', async () => {
    const user = {
      name: 'Caio Paulista',
      email: 'teste2@teste.com',
      level: 1,
      password: '123456',
    }

    const response = await createUser.execute(user)

    await deleteUser.execute({
      id: response.id,
      adminId: adminUser.id,
    })

    const users = await findUsers.execute({
      email: user.email,
    })

    expect(users[0].deleted).toBe(true)
  })
  it('should not be able to delete an User if you are not admin', async () => {
    const user = {
      name: 'Caio Paulista',
      email: 'teste2@teste.com',
      level: 1,
      password: '123456',
    }
    const response = await createUser.execute(user)

    const notAdminUser = {
      name: 'Roger Machado',
      email: 'roger@teste.com',
      level: 2,
      password: '123456',
    }

    const responseNotAdmin = await createUser.execute(notAdminUser)

    await expect(
      deleteUser.execute({
        id: response.id,
        adminId: responseNotAdmin.id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to delete an User with invalid id', async () => {
    const user = {
      name: 'Caio Paulista',
      email: 'teste2@teste.com',
      level: 1,
      password: '123456',
    }
    const response = await createUser.execute(user)

    await expect(
      deleteUser.execute({
        id: 'dhauishdaiuhduad',
        adminId: response.id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to an User to delete itself', async () => {
    const user = {
      name: 'Caio Paulista',
      email: 'teste2@teste.com',
      level: 1,
      password: '123456',
    }
    const response = await createUser.execute(user)

    await expect(
      deleteUser.execute({
        id: response.id,
        adminId: response.id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
