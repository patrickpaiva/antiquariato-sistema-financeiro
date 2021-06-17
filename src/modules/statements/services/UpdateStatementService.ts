import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { validate } from 'uuid'
import Statement from '../infra/typeorm/entities/Statement'
import IStatementsRepository from '../repositories/IStatementsRepository'

interface IRequest {
  id: string
  bank_id?: number
  account_id?: number
  transaction_type?: string
  value?: number
  transaction_history?: string
  transaction_method?: string
  userId: string
}

@injectable()
class UpdateStatementService {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    id,
    userId,
    ...params
  }: IRequest): Promise<Statement> {
    if (validate(id) === false) {
      throw new AppError('Invalid id, please check your request')
    }
    const findStatement = await this.statementsRepository.findById(id)
    const findUser = await this.usersRepository.findById(userId)

    if (!findStatement) {
      throw new AppError('Statement not found')
    }

    if (!findUser) {
      throw new AppError('User not found', 404)
    }

    if (findStatement.entry_id && validate(findStatement.entry_id)) {
      throw new AppError(
        'Cannot update a Statement that is already linked to a General Entry, please unlink it first.',
      )
    }

    const updatedStatement = {
      ...findStatement,
      ...params,
      last_update_date: new Date(),
      last_update_by: userId,
    }

    return this.statementsRepository.update(updatedStatement)
  }
}

export default UpdateStatementService
