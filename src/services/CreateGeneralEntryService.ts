import { getCustomRepository } from 'typeorm'
import GeneralEntry from '../models/GeneralEntry'
import GeneralEntriesRepository from '../repositories/GeneralEntriesRepository'

interface Request {
  date: Date
  description: string
  value: number
  type: string
  status: string
  cost_center: string
  presentation_rubric: string
  specific_rubric: string
  statement_id?: string
  created_by: string
  authorized_by?: string
}

class CreateGeneralEntryService {
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
  }: Request): Promise<GeneralEntry> {
    const generalEntriesRepository = getCustomRepository(
      GeneralEntriesRepository,
    )

    const generalEntry = generalEntriesRepository.create({
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

    await generalEntriesRepository.save(generalEntry)

    return generalEntry
  }
}

export default CreateGeneralEntryService
