import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateStatementService from '@modules/statements/services/CreateStatementService'

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
}
