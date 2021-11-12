import ICreateAccountDTO from '@modules/accounts/dtos/ICreateAccountDTO'
import IFilterAccountsParamsDTO from '@modules/accounts/dtos/IFilterAccountsParamsDTO'
import Account from '@modules/accounts/infra/typeorm/entities/Account'
import { v4 as uuid } from 'uuid'
import IAccountsRepository from '../IAccountsRepository'

class FakeAccountsRepository implements IAccountsRepository {
  private accounts: Account[] = []

  public async findById(id: string): Promise<Account | undefined> {
    const findAccount = this.accounts.find(account => account.id === id)

    return findAccount
  }

  public async findByBank(bank_name: string): Promise<Account | undefined> {
    const findAccount = this.accounts.find(
      account => account.bank_name === bank_name,
    )

    return findAccount
  }

  public async findAll({
    ...params
  }: IFilterAccountsParamsDTO): Promise<Account[] | undefined> {
    if (Object.keys(params).length === 0) {
      return this.accounts
    } else {
      let filteredAccounts: Account[] = [...this.accounts]

      if (params.bank_number) {
        filteredAccounts = filteredAccounts.filter(
          account => account.bank_number === params.bank_number,
        )
      }
      if (params.bank_name) {
        filteredAccounts = filteredAccounts.filter(
          account => account.bank_name === params.bank_name,
        )
      }
      if (params.agency_number) {
        filteredAccounts = filteredAccounts.filter(
          account => account.agency_number === params.agency_number,
        )
      }
      if (params.account_number) {
        filteredAccounts = filteredAccounts.filter(
          account => account.account_number === params.account_number,
        )
      }
      if (params.account_type) {
        filteredAccounts = filteredAccounts.filter(
          account => account.account_type === params.account_type,
        )
      }
      if (params.id) {
        filteredAccounts = filteredAccounts.filter(
          account => account.id === params.id,
        )
      }

      return filteredAccounts
    }
  }

  public async create({
    bank_number,
    agency_number,
    account_number,
    account_type,
  }: ICreateAccountDTO): Promise<Account> {
    const account = new Account()

    Object.assign(account, {
      id: uuid(),
      bank_number,
      agency_number,
      account_number,
      account_type,
    })

    this.accounts.push(account)

    return account
  }

  public async save(account: Account): Promise<Account> {
    const filteredAccounts = this.accounts.filter(
      item => item.id !== account.id,
    )

    filteredAccounts.push(account)

    this.accounts = filteredAccounts

    return account
  }

  public async delete(account: Account): Promise<void> {
    const filteredAccounts = this.accounts.filter(
      item => item.id !== account.id,
    )

    this.accounts = filteredAccounts
  }

  public async update(account: Account): Promise<Account> {
    const filteredAccounts = this.accounts.filter(
      item => item.id !== account.id,
    )

    filteredAccounts.push(account)

    this.accounts = filteredAccounts

    return account
  }
}

export default FakeAccountsRepository
