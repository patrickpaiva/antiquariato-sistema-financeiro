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
    minDate,
    maxDate,
    maxValue,
    minValue,
    transaction_type,
  }: IFilterStatementsParamsDTO): Promise<Statement[] | undefined> {
    if (!minDate || !maxDate || !maxValue || !minValue || !transaction_type) {
      return this.statements
    }

    const filteredStatements: Statement[] = []

    if (minDate && maxDate) {
      const statements = this.statements.filter(
        statement => statement.date >= minDate || statement.date <= maxDate,
      )
      filteredStatements.concat(statements)
    }

    if (minValue && maxValue) {
      const statements = this.statements.filter(
        statement => statement.value >= minValue || statement.value <= maxValue,
      )
      filteredStatements.concat(statements)
    }

    if (transaction_type) {
      const statements = this.statements.filter(
        statement => statement.transaction_type === transaction_type,
      )
      filteredStatements.concat(statements)
    }

    return filteredStatements
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

  public async save(statement: Statement): Promise<Statement> {
    this.statements.push(statement)
    return statement
  }
}

export default StatementsRepository
