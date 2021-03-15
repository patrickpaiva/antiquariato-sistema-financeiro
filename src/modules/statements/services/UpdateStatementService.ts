import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { validate } from 'uuid'
import Statement from '../infra/typeorm/entities/Statement'
import IStatementsRepository from '../repositories/IStatementsRepository'

interface IRequest {
  id: string
  date: Date
  bank_id?: number
  account_id?: number
  transaction_type?: string
  value?: number
  transaction_history?: string
  transaction_method?: string
}

@injectable()
class UpdateStatementService {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
  ) {}

  public async execute({ id, ...params }: IRequest): Promise<Statement> {
    if (validate(id) === false) {
      throw new AppError('Invalid id, please check your request')
    }
    const findStatement = await this.statementsRepository.findById(id)

    if (!findStatement) {
      throw new AppError('Statement not found')
    }

    if (findStatement.entry_id && validate(findStatement.entry_id)) {
      throw new AppError(
        'Cannot update a Statemen which is already linked to a General Entry',
      )
    }

    const updatedStatement = {
      ...findStatement,
      ...params,
    }

    return this.statementsRepository.update(updatedStatement)
  }
}

export default UpdateStatementService
