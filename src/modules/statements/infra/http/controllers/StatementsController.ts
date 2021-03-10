import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateStatementService from '@modules/statements/services/CreateStatementService'
import ListStatementsService from '@modules/statements/services/ListStatementsService'

export default class StatementsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      date,
      bank_id,
      account_id,
      transaction_type,
      value,
      transaction_history,
      transaction_method,
      created_by,
    } = request.body

    const createStatement = container.resolve(CreateStatementService)

    const statement = await createStatement.execute({
      date,
      bank_id,
      account_id,
      transaction_type,
      value,
      transaction_history,
      transaction_method,
      created_by,
    })

    return response.json(statement)
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const listStatements = container.resolve(ListStatementsService)

    const statements = await listStatements.execute(request.body)

    return response.json(statements)
  }
}
