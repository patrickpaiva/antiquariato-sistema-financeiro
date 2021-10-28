import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import CreateUserService from './CreateUserService'
import ListUsersService from './ListUsersService'

let fakeUsersRepository: FakeUsersRepository
let createUser: CreateUserService
let findUsers: ListUsersService

describe('ListUser', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()

    createUser = new CreateUserService(fakeUsersRepository)
    findUsers = new ListUsersService(fakeUsersRepository)

    const newUser = {
      name: 'Patrick',
      email: 'teste@teste.com',
      level: 1,
      password: '123456',
    }

    await createUser.execute(newUser)
  })
  it('should be able to list all Users', async () => {
    const user = {
      name: 'Caio Paulista',
      email: 'teste2@teste.com',
      level: 1,
      password: '123456',
    }

    await createUser.execute(user)

    const users = await findUsers.execute()

    expect(users).toHaveLength(2)
  })
  it('should be able to list all Users with same level', async () => {
    const user = {
      name: 'Caio Paulista',
      email: 'teste2@teste.com',
      level: 2,
      password: '123456',
    }

    await createUser.execute(user)

    const user2 = {
      name: 'Caio Junior',
      email: 'teste3@teste.com',
      level: 2,
      password: '123456',
    }

    await createUser.execute(user2)

    const allUsers = await findUsers.execute()
    const users = await findUsers.execute({ level: 2 })

    expect(users).toHaveLength(2)
    expect(allUsers).toHaveLength(3)
  })
  it('should be able to list an specific User by e-mail', async () => {
    const user = {
      name: 'Caio Paulista',
      email: 'teste2@teste.com',
      level: 2,
      password: '123456',
    }

    await createUser.execute(user)

    const users = await findUsers.execute({ email: 'teste2@teste.com' })

    expect(users[0].name).toBe('Caio Paulista')
  })
})
