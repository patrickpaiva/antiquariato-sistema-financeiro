import ICreateUserDTO from '../dtos/ICreateUserDTO'
import IFilterUsersParamsDTO from '../dtos/IFilterUsersParamsDTO'
import User from '../infra/typeorm/entities/User'

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>
  findByEmail(email: string): Promise<User | undefined>
  findAll(params?: IFilterUsersParamsDTO): Promise<User[] | undefined>
  create(data: ICreateUserDTO): Promise<User>
  save(user: User): Promise<User>
}
