import FakeAccountsRepository from '../repositories/fakes/FakeAccountsRepository'
import CreateAccountService from './CreateAccountService'
import ListAccountsService from './ListAccountsService'

let fakeAccountsRepository: FakeAccountsRepository
let createAccount: CreateAccountService
let findAccounts: ListAccountsService

describe('ListAccount', () => {
  beforeEach(async () => {
    fakeAccountsRepository = new FakeAccountsRepository()

    createAccount = new CreateAccountService(fakeAccountsRepository)
    findAccounts = new ListAccountsService(fakeAccountsRepository)

    const newAccount = {
      bank_number: 100,
      agency_number: 1,
      account_number: 1234,
      account_type: 1,
      bank_name: 'teste',
    }

    await createAccount.execute(newAccount)
  })
  it('should be able to list all Accounts', async () => {
    const account = {
      bank_number: 102,
      agency_number: 4539,
      account_number: 12345,
      account_type: 1,
      bank_name: 'teste',
    }

    await createAccount.execute(account)

    const accounts = await findAccounts.execute()

    expect(accounts).toHaveLength(2)
  })
  it('should be able to list all Accounts from the same bank', async () => {
    const account = {
      bank_number: 101,
      agency_number: 4539,
      account_number: 12345,
      account_type: 1,
      bank_name: 'teste',
    }

    await createAccount.execute(account)

    const account2 = {
      bank_number: 101,
      agency_number: 4539,
      account_number: 123457,
      account_type: 1,
      bank_name: 'teste',
    }

    await createAccount.execute(account2)

    const allAccounts = await findAccounts.execute()
    const accounts = await findAccounts.execute({ bank_number: 101 })

    expect(accounts).toHaveLength(2)
    expect(allAccounts).toHaveLength(3)
  })
  it('should be able to list an specific Account using bank, agency and account', async () => {
    const account = {
      bank_number: 101,
      agency_number: 4539,
      account_number: 12345,
      account_type: 1,
      bank_name: 'teste',
    }

    await createAccount.execute(account)

    const accounts = await findAccounts.execute({
      bank_number: 101,
      agency_number: 4539,
      account_number: 12345,
    })

    expect(accounts[0].account_type).toBe(1)
  })
})
