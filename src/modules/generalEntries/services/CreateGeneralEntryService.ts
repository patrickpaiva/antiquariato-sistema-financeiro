import GeneralEntry from '@modules/generalEntries/infra/typeorm/entities/GeneralEntry'
import IGeneralEntriesRepository from '@modules/generalEntries/repositories/IGeneralEntriesRepository'
import { injectable, inject } from 'tsyringe'

interface IRequest {
  date: Date
  description: string
  value: number
  type: string
  status: string
  cost_center: string
  presentation_rubric: string
  specific_rubric: string
  statement_id?: string | null
  created_by: string
  authorized_by?: string
}

@injectable()
class CreateGeneralEntryService {
  constructor(
    @inject('GeneralEntriesRepository')
    private generalEntriesRepository: IGeneralEntriesRepository,
  ) {}

  public async execute({
    date,
    description,
    value,
    type,
    status,
    cost_center,
    presentation_rubric,
    specific_rubric,
    statement_id,
    created_by,
    authorized_by,
  }: IRequest): Promise<GeneralEntry> {
    const generalEntry = await this.generalEntriesRepository.create({
      date,
      description,
      value,
      type,
      status,
      cost_center,
      presentation_rubric,
      specific_rubric,
      statement_id,
      created_by,
      authorized_by,
    })

    return generalEntry
  }
}

export default CreateGeneralEntryService
