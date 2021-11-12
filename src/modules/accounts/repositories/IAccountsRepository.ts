import ICreateAccountDTO from '../dtos/ICreateAccountDTO'
import IFilterAccountsParamsDTO from '../dtos/IFilterAccountsParamsDTO'
import Account from '../infra/typeorm/entities/Account'

export default interface IAccountsRepository {
  findById(id: string): Promise<Account | undefined>
  findByBank(bank_name: string): Promise<Account | undefined>
  findAll(params?: IFilterAccountsParamsDTO): Promise<Account[] | undefined>
  create(data: ICreateAccountDTO): Promise<Account>
  save(user: Account): Promise<Account>
  delete(user: Account): Promise<void>
  update(user: Account): Promise<Account>
}
