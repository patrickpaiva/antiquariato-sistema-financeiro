import Statement from '@modules/statements/infra/typeorm/entities/Statement'
import { getRepository, Repository } from 'typeorm'

import IStatementRepository from '@modules/statements/repositories/IStatementsRepository'
import ICreateStatementDTO from '@modules/statements/dtos/ICreateStatementDTO'

class StatementsRepository implements IStatementRepository {
  private ormRepository: Repository<Statement>

  constructor() {
    this.ormRepository = getRepository(Statement)
  }

  public async findById(id: string): Promise<Statement | undefined> {
    const findStatement = await this.ormRepository.findOne(id)

    if (!findStatement) {
      throw new Error('Statement not found')
    }

    return findStatement
  }

  public async create({
    date,
    bank_id,
    account_id,
    transaction_type,
    value,
    transaction_history,
    transaction_method,
    created_by,
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = await this.ormRepository.create({
      date,
      bank_id,
      account_id,
      transaction_type,
      value,
      transaction_history,
      transaction_method,
      created_by,
    })

    await this.ormRepository.save(statement)

    return statement
  }

  public async save(statement: Statement): Promise<Statement> {
    return this.ormRepository.save(statement)
  }
}

export default StatementsRepository
