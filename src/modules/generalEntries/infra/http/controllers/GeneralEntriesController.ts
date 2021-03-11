import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateGeneralEntryService from '@modules/generalEntries/services/CreateGeneralEntryService'
import LinkGeneralEntryToStatementService from '@modules/generalEntries/services/LinkGeneralEntryToStatementService'
import ListAllGeneralEntriesService from '@modules/generalEntries/services/ListAllGeneralEntriesService'
import UnlinkGeneralEntryToStatementService from '@modules/generalEntries/services/UnlinkGeneralEntryToStatementService'
import UpdateGeneralEntryService from '@modules/generalEntries/services/UpdateGeneralEntryService'
import DeleteGeneralEntryService from '@modules/generalEntries/services/DeleteGeneralEntryService'

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

  public async unlinkStatement(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id, statement_id } = request.body

    const unlinkGeneralEntryToStatementService = container.resolve(
      UnlinkGeneralEntryToStatementService,
    )

    const unlink = await unlinkGeneralEntryToStatementService.execute({
      id,
      statement_id,
    })

    return response.json(unlink)
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const listGeneralEntries = container.resolve(ListAllGeneralEntriesService)

    const generalEntries = await listGeneralEntries.execute(request.body)

    return response.json(generalEntries)
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const updateGeneralEntries = container.resolve(UpdateGeneralEntryService)

    await updateGeneralEntries.execute(request.body)

    return response.json({ message: 'Updated Successfully' })
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const deleteGeneralEntries = container.resolve(DeleteGeneralEntryService)

    await deleteGeneralEntries.execute(request.body)

    return response.json({ message: 'Deleted Successfully' })
  }
}
