import ICreateAccountDTO from '@modules/accounts/dtos/ICreateAccountDTO'
import IFilterAccountsParamsDTO from '@modules/accounts/dtos/IFilterAccountsParamsDTO'
import Account from '@modules/accounts/infra/typeorm/entities/Account'
import IAccountsRepository from '@modules/accounts/repositories/IAccountsRepository'
import { Equal, getRepository, ILike, IsNull, Not, Repository } from 'typeorm'

class AccountsRepository implements IAccountsRepository {
  private ormRepository: Repository<Account>

  constructor() {
    this.ormRepository = getRepository(Account)
  }

  public async findById(id: string): Promise<Account | undefined> {
    const findAccount = await this.ormRepository.findOne({
      where: { id },
    })

    return findAccount
  }

  public async findByBank(bank_number: string): Promise<Account | undefined> {
    const findAccount = await this.ormRepository.findOne({
      where: { bank_number },
    })

    return findAccount
  }

  public async findAll(
    params: IFilterAccountsParamsDTO,
  ): Promise<Account[] | undefined> {
    if (Object.keys(params).length === 0) {
      const accounts = await this.ormRepository.find({
        order: {
          bank_name: 'DESC',
        },
      })
      return accounts
    } else {
      const accounts = await this.ormRepository.find({
        bank_name: params.bank_name
          ? params.bank_name && ILike(`%${params.bank_name}%`)
          : Not(IsNull()),
        bank_number: params.bank_number
          ? params.bank_number && Equal(params.bank_number)
          : Not(IsNull()),
        agency_number: params.agency_number
          ? params.agency_number && Equal(params.agency_number)
          : Not(IsNull()),
        account_number: params.account_number
          ? params.account_number && Equal(params.account_number)
          : Not(IsNull()),
        account_type: params.account_type
          ? params.account_type && Equal(params.account_type)
          : Not(IsNull()),
        id: params.id ? params.id && Equal(params.id) : Not(IsNull()),
      })

      return accounts
    }
  }

  public async create({
    bank_number,
    agency_number,
    account_number,
    account_type,
  }: ICreateAccountDTO): Promise<Account> {
    const account = this.ormRepository.create({
      bank_number,
      agency_number,
      account_number,
      account_type,
    })

    await this.ormRepository.save(account)

    return account
  }

  public async save(account: Account): Promise<Account> {
    return this.ormRepository.save(account)
  }

  public async delete(account: Account): Promise<void> {
    await this.ormRepository.delete(account)
  }

  public async update(account: Account): Promise<Account> {
    return await this.ormRepository.save(account)
  }
}

export default AccountsRepository
