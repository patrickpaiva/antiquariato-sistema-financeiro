import User from '@modules/users/infra/typeorm/entities/User'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import CreateUserService from '@modules/users/services/CreateUserService'
import AppError from '@shared/errors/AppError'
import FakeAccountsRepository from '../repositories/fakes/FakeAccountsRepository'
import CreateAccountService from './CreateAccountService'
import DeleteAccountService from './DeleteAccountService'
import ListAccountsService from './ListAccountsService'

let fakeAccountsRepository: FakeAccountsRepository
let fakeUsersRepository: FakeUsersRepository
let createAccount: CreateAccountService
let createUser: CreateUserService
let deleteAccount: DeleteAccountService
let findAccounts: ListAccountsService
let adminUser: User

describe('DeleteAccount', () => {
  beforeEach(async () => {
    fakeAccountsRepository = new FakeAccountsRepository()
    fakeUsersRepository = new FakeUsersRepository()

    createAccount = new CreateAccountService(fakeAccountsRepository)
    deleteAccount = new DeleteAccountService(
      fakeAccountsRepository,
      fakeUsersRepository,
    )
    findAccounts = new ListAccountsService(fakeAccountsRepository)
    createUser = new CreateUserService(fakeUsersRepository)

    const newUser = {
      name: 'Patrick',
      email: 'teste@teste.com',
      level: 1,
      password: '123456',
    }

    adminUser = await createUser.execute(newUser)
  })
  it('should be able to delete an Account', async () => {
    const account = {
      bank_number: 100,
      agency_number: 1,
      account_number: 1234,
      account_type: 1,
      bank_name: 'teste',
    }

    const response = await createAccount.execute(account)

    await deleteAccount.execute({
      id: response.id,
      adminId: adminUser.id,
    })

    const accounts = await findAccounts.execute({
      bank_number: account.bank_number,
      agency_number: account.agency_number,
      account_number: account.account_number,
    })

    expect(accounts[0].deleted).toBe(true)
  })
  it('should not be able to delete an Account if you are not admin', async () => {
    const account = {
      bank_number: 100,
      agency_number: 1,
      account_number: 1234,
      account_type: 1,
      bank_name: 'teste',
    }

    const response = await createAccount.execute(account)

    const notAdminUser = {
      name: 'Roger Machado',
      email: 'roger@teste.com',
      level: 2,
      password: '123456',
    }

    const responseNotAdmin = await createUser.execute(notAdminUser)

    await expect(
      deleteAccount.execute({
        id: response.id,
        adminId: responseNotAdmin.id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to delete an Account with invalid id', async () => {
    await expect(
      deleteAccount.execute({
        id: 'dhauishdaiuhduad',
        adminId: adminUser.id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
