import ICreateStatementDTO from '@modules/statements/dtos/ICreateStatementDTO'
import IFilterStatementsParamsDTO from '@modules/statements/dtos/IFilterStatementsParamsDTO'
import Statement from '@modules/statements/infra/typeorm/entities/Statement'
import IStatementRepository from '@modules/statements/repositories/IStatementsRepository'
import { v4 as uuid } from 'uuid'

class StatementsRepository implements IStatementRepository {
  private statements: Statement[] = []

  public async findById(id: string): Promise<Statement | undefined> {
    const statement = this.statements.find(item => item.id === id)

    return statement
  }

  public async findAll({
    ...params
  }: IFilterStatementsParamsDTO): Promise<Statement[] | undefined> {
    // return this.statements
    if (Object.keys(params).length === 0) {
      return this.statements
    } else {
      const filteredStatements: Statement[] = []

      if (params.minDate && params.maxDate) {
        const statements = this.statements.filter(
          statement =>
            statement.date >= (params.minDate || '') ||
            statement.date <= (params.maxDate || ''),
        )
        filteredStatements.concat(statements)
      }

      if (params.minValue && params.maxValue) {
        const statements = this.statements.filter(
          statement =>
            statement.value >= (params.minValue || '') ||
            statement.value <= (params.maxValue || ''),
        )
        filteredStatements.concat(statements)
      }

      if (params.transaction_type) {
        const statements = this.statements.filter(
          statement => statement.transaction_type === params.transaction_type,
        )
        filteredStatements.concat(statements)
      }

      return filteredStatements
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
    created_manually,
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = new Statement()

    Object.assign(statement, {
      id: uuid(),
      date,
      bank_id,
      account_id,
      transaction_type,
      value,
      transaction_history,
      transaction_method,
      created_by,
      created_manually,
    })

    this.statements.push(statement)

    return statement
  }

  public async update(statement: Statement): Promise<Statement> {
    const filteredGeneralEntries = this.statements.filter(
      item => item.id !== statement.id,
    )

    filteredGeneralEntries.push(statement)

    this.statements = filteredGeneralEntries

    return statement
  }
}

export default StatementsRepository
