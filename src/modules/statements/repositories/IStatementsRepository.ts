import Statement from '@modules/statements/infra/typeorm/entities/Statement'
import ICreateStatementDTO from '../dtos/ICreateStatementDTO'
import IFilterStatementsParamsDTO from '../dtos/IFilterStatementsParamsDTO'

export default interface IStatementRepository {
  create(data: ICreateStatementDTO): Promise<Statement>
  save(statement: Statement): Promise<Statement>
  findById(id: string): Promise<Statement | undefined>
  findAll(params: IFilterStatementsParamsDTO): Promise<Statement[] | undefined>
}
