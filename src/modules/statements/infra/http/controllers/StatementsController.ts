import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateStatementService from '@modules/statements/services/CreateStatementService'
import ListStatementsService from '@modules/statements/services/ListStatementsService'
import DeleteStatementService from '@modules/statements/services/DeleteStatementService'
import UpdateStatementService from '@modules/statements/services/UpdateStatementService'
import { ImportStatementsService } from '@modules/statements/services/ImportStatementsService'
import { UnDoImportStatementesService } from '@modules/statements/services/UnDoImportStatementsService'

export default class StatementsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      date,
      bank_number,
      account_number,
      transaction_type,
      value,
      transaction_history,
      transaction_document,
      created_by,
    } = request.body

    const createStatement = container.resolve(CreateStatementService)

    const statement = await createStatement.execute({
      date,
      bank_number,
      account_number,
      transaction_type,
      value,
      transaction_history,
      transaction_document,
      created_by,
    })

    return response.json(statement)
  }

  public async import(request: Request, response: Response): Promise<Response> {
    const { created_by } = request.body
    const { file } = request

    const importStatements = container.resolve(ImportStatementsService)

    await importStatements.execute(file, created_by)

    return response.status(201).send()
  }

  public async unDoImport(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.body

    const unDoImportStatements = container.resolve(UnDoImportStatementesService)

    await unDoImportStatements.execute(id)

    return response.status(201).send()
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const listStatements = container.resolve(ListStatementsService)

    const statements = await listStatements.execute(request.body)

    return response.json(statements)
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const updateStatement = container.resolve(UpdateStatementService)

    const statement = await updateStatement.execute(request.body)

    return response.json(statement)
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const deleteStatement = container.resolve(DeleteStatementService)

    await deleteStatement.execute(request.body)

    return response.json({ message: 'Deleted Successfully' })
  }
}
