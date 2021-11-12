import User from '@modules/users/infra/typeorm/entities/User'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import CreateUserService from '@modules/users/services/CreateUserService'
import AppError from '@shared/errors/AppError'
import FakeAccountsRepository from '../repositories/fakes/FakeAccountsRepository'
import CreateAccountService from './CreateAccountService'
import ListAccountsService from './ListAccountsService'
import UpdateAccountService from './UpdateAccountService'

let fakeAccountsRepository: FakeAccountsRepository
let fakeUsersRepository: FakeUsersRepository
let createAccount: CreateAccountService
let createUser: CreateUserService
let findAccounts: ListAccountsService
let updateAccount: UpdateAccountService
let adminUser: User

describe('UpdateAccount', () => {
  beforeEach(async () => {
    fakeAccountsRepository = new FakeAccountsRepository()
    fakeUsersRepository = new FakeUsersRepository()

    createAccount = new CreateAccountService(fakeAccountsRepository)
    createUser = new CreateUserService(fakeUsersRepository)
    findAccounts = new ListAccountsService(fakeAccountsRepository)
    updateAccount = new UpdateAccountService(
      fakeAccountsRepository,
      fakeUsersRepository,
    )

    const newUser = {
      name: 'Patrick',
      email: 'teste@teste.com',
      level: 1,
      password: '123456',
    }

    adminUser = await createUser.execute(newUser)
  })
  it('should be able to update an Account', async () => {
    const account = {
      bank_number: 100,
      agency_number: 1,
      account_number: 1234,
      account_type: 1,
    }

    await createAccount.execute(account)

    const findAccount = await findAccounts.execute({
      bank_number: account.bank_number,
      agency_number: account.agency_number,
      account_number: account.account_number,
    })

    await updateAccount.execute({
      id: findAccount[0].id,
      adminId: adminUser.id,
      bank_number: 100,
      agency_number: 1,
      account_number: 1234,
      account_type: 2,
    })

    const accounts = await findAccounts.execute({ id: findAccount[0].id })

    expect(accounts).toHaveLength(1)
    expect(accounts[0].account_type).toBe(2)
  })

  it('should not be able to update an Account without admin access', async () => {
    const account = {
      bank_number: 100,
      agency_number: 1,
      account_number: 1234,
      account_type: 1,
    }

    await createAccount.execute(account)

    const user = {
      name: 'Caio Paulista',
      email: 'teste3@teste.com',
      level: 2,
      password: '123456',
    }

    const notAdminAccount = await createUser.execute(user)

    const findAccount = await findAccounts.execute({
      bank_number: account.bank_number,
      agency_number: account.agency_number,
      account_number: account.account_number,
    })

    await expect(
      updateAccount.execute({
        id: findAccount[0].id,
        adminId: notAdminAccount.id,
        bank_number: 100,
        agency_number: 1,
        account_number: 1234,
        account_type: 2,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to update an invalid Account', async () => {
    await expect(
      updateAccount.execute({
        id: 'uahsduahduisad',
        adminId: adminUser.id,
        bank_number: 100,
        agency_number: 1,
        account_number: 1234,
        account_type: 2,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to update an Account with invalid credential', async () => {
    const account = {
      bank_number: 100,
      agency_number: 1,
      account_number: 1234,
      account_type: 1,
    }

    const accountToUpdate = await createAccount.execute(account)

    await expect(
      updateAccount.execute({
        id: accountToUpdate.id,
        adminId: 'uhdaushduadha',
        bank_number: 100,
        agency_number: 1,
        account_number: 1234,
        account_type: 2,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to update an Accounts using data already in use', async () => {
    const account = {
      bank_number: 100,
      agency_number: 1,
      account_number: 1234,
      account_type: 1,
    }

    await createAccount.execute(account)

    const account2 = {
      bank_number: 101,
      agency_number: 2,
      account_number: 12345,
      account_type: 2,
    }

    await createAccount.execute(account2)

    const findAccount = await findAccounts.execute({
      bank_number: account.bank_number,
      agency_number: account.agency_number,
      account_number: account.account_number,
    })

    await expect(
      updateAccount.execute({
        id: findAccount[0].id,
        adminId: adminUser.id,
        bank_number: 101,
        agency_number: 2,
        account_number: 12345,
        account_type: 2,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
