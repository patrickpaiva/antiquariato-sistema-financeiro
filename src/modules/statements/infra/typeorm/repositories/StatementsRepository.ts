import Statement from '@modules/statements/infra/typeorm/entities/Statement'
import { Between, Equal, getRepository, IsNull, Not, Repository } from 'typeorm'

import IStatementRepository from '@modules/statements/repositories/IStatementsRepository'
import ICreateStatementDTO from '@modules/statements/dtos/ICreateStatementDTO'
import IFilterStatementsParamsDTO from '@modules/statements/dtos/IFilterStatementsParamsDTO'

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

  public async findAll(
    params: IFilterStatementsParamsDTO,
  ): Promise<Statement[] | undefined> {
    if (Object.keys(params).length === 0) {
      const statements = await this.ormRepository.find({
        order: {
          date: 'DESC',
        },
      })
      return statements
    } else {
      const statements = await this.ormRepository.find({
        date:
          params.minDate && params.maxDate
            ? Between(params.minDate, params.maxDate)
            : Not(IsNull()),
        value:
          params.minValue && params.maxValue
            ? Between(params.minValue, params.maxValue)
            : Not(IsNull()),
        transaction_type:
          params.transaction_type && Equal(params.transaction_type),
      })

      return statements
    }
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
