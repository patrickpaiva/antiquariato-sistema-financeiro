import AppError from '@shared/errors/AppError'
import FakeAccountsRepository from '../repositories/fakes/FakeAccountsRepository'
import CreateAccountService from './CreateAccountService'

let fakeAccountsRepository: FakeAccountsRepository
let createAccount: CreateAccountService

describe('CreateAccount', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository()

    createAccount = new CreateAccountService(fakeAccountsRepository)
  })
  it('should be able to create a Account', async () => {
    const newAccount = {
      bank_number: 100,
      agency_number: 1,
      account_number: 1234,
      account_type: 1,
    }

    const fakeAccount = await createAccount.execute(newAccount)

    expect(fakeAccount.account_number).toBe(1234)
    expect(fakeAccount).toHaveProperty('id')
  })
  it('should not be able to create a Account that was already registered', async () => {
    const newAccount = {
      bank_number: 100,
      agency_number: 1,
      account_number: 1234,
      account_type: 1,
    }

    await createAccount.execute(newAccount)

    const secondAccount = {
      bank_number: 100,
      agency_number: 1,
      account_number: 1234,
      account_type: 1,
    }

    await expect(createAccount.execute(secondAccount)).rejects.toBeInstanceOf(
      AppError,
    )
  })
})
