import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

let fakeUsersRepository: FakeUsersRepository
let createUser: CreateUserService
let authenticateUser: AuthenticateUserService

describe('AuthenticateUser', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()

    createUser = new CreateUserService(fakeUsersRepository)
    authenticateUser = new AuthenticateUserService(fakeUsersRepository)

    const newUser = {
      name: 'Patrick',
      email: 'teste@teste.com',
      level: 1,
      password: '123456',
    }

    await createUser.execute(newUser)
  })
  it('should be able to Authenticate a User', async () => {
    const authenticatedUser = await authenticateUser.execute({
      email: 'teste@teste.com',
      password: '123456',
    })

    expect(authenticatedUser).toHaveProperty('token')
  })
  it('should not be able to Authenticate an User with invalid email', async () => {
    await expect(
      authenticateUser.execute({
        email: 'teste2@teste.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to Authenticate an User with invalid password', async () => {
    await expect(
      authenticateUser.execute({
        email: 'teste@teste.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
