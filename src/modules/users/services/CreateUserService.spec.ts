import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import CreateUserService from './CreateUserService'

let fakeUsersRepository: FakeUsersRepository
let createUser: CreateUserService

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()

    createUser = new CreateUserService(fakeUsersRepository)
  })
  it('should be able to create a User', async () => {
    const newUser = {
      name: 'Patrick',
      email: 'teste@teste.com',
      level: 1,
      password: '123456',
    }

    const fakeUser = await createUser.execute(newUser)

    expect(fakeUser.email).toBe('teste@teste.com')
    expect(fakeUser).toHaveProperty('id')
  })
  it('should not be able to create a User with an email already in use', async () => {
    const newUser = {
      name: 'Patrick',
      email: 'teste@teste.com',
      level: 1,
      password: '123456',
    }

    await createUser.execute(newUser)

    const secondUser = {
      name: 'Patrick2',
      email: 'teste@teste.com',
      level: 1,
      password: '1234567',
    }

    await expect(createUser.execute(secondUser)).rejects.toBeInstanceOf(
      AppError,
    )
  })
})
