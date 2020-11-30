import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateGeneralEntryService from '@modules/generalEntries/services/CreateGeneralEntryService'
import LinkGeneralEntryToStatementService from '@modules/generalEntries/services/LinkGeneralEntryToStatementService'

export default class GeneralEntriesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      date,
      description,
      value,
      type,
      status,
      cost_center,
      presentation_rubric,
      specific_rubric,
      created_by,
      authorized_by,
    } = request.body

    const createGeneralEntry = container.resolve(CreateGeneralEntryService)

    const generalEntry = await createGeneralEntry.execute({
      date,
      description,
      value,
      type,
      status,
      cost_center,
      presentation_rubric,
      specific_rubric,
      created_by,
      authorized_by,
    })

    return response.json(generalEntry)
  }

  public async linkStatement(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, statement_id } = request.body

    const linkGeneralEntryToStatementService = container.resolve(
      LinkGeneralEntryToStatementService,
    )

    const link = await linkGeneralEntryToStatementService.execute({
      id,
      statement_id,
    })

    return response.json(link)
  }
}
