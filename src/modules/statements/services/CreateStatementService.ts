import Statement from '@modules/statements/infra/typeorm/entities/Statement'
import IStatementsRepository from '@modules/statements/repositories/IStatementsRepository'
import { injectable, inject } from 'tsyringe'

interface IRequest {
  date: Date
  bank_number: number
  account_number: number
  transaction_type: string
  value: number
  transaction_history: string
  transaction_document: string
  entry_id?: string | null
  created_by: string
}

@injectable()
class CreateStatementService {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
  ) {}

  public async execute({
    date,
    bank_number,
    account_number,
    transaction_type,
    value,
    transaction_history,
    transaction_document,
    created_by,
  }: IRequest): Promise<Statement> {
    const statement = await this.statementsRepository.create({
      date,
      bank_number,
      account_number,
      transaction_type,
      value,
      transaction_history,
      transaction_document,
      created_by,
      created_manually: true,
    })

    return statement
  }
}

export default CreateStatementService
