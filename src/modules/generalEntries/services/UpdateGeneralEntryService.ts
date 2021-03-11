import IGeneralEntriesRepository from '@modules/generalEntries/repositories/IGeneralEntriesRepository'
import { inject, injectable } from 'tsyringe'
import GeneralEntry from '../infra/typeorm/entities/GeneralEntry'
import { validate } from 'uuid'
import AppError from '@shared/errors/AppError'

interface IRequest {
  id: string
  date?: Date
  description?: string
  value?: number
  type?: string
  status?: string
  cost_center?: string
  presentation_rubric?: string
  specific_rubric?: string
  authorized_by?: string
}

@injectable()
class UpdateGeneralEntryService {
  constructor(
    @inject('GeneralEntriesRepository')
    private generalEntriesRepository: IGeneralEntriesRepository,
  ) {}

  public async execute({ id, ...params }: IRequest): Promise<GeneralEntry> {
    const findEntry = await this.generalEntriesRepository.findById(id)

    if (!findEntry) {
      throw new AppError('General Entry not found')
    }

    if (findEntry.statement_id && validate(findEntry.statement_id)) {
      throw new AppError(
        'Cannot update a General Entry which is already linked to a statement',
      )
    }

    const updatedEntry = {
      ...findEntry,
      ...params,
    }

    const updatedGeneralEntry = await this.generalEntriesRepository.update(
      updatedEntry,
    )

    return updatedGeneralEntry
  }
}

export default UpdateGeneralEntryService
