import GeneralEntry from '@modules/generalEntries/infra/typeorm/entities/GeneralEntry'
import { getRepository, Repository } from 'typeorm'

import IGeneralEntriesRepository from '@modules/generalEntries/repositories/IGeneralEntriesRepository'
import ICreateGeneralEntryDTO from '@modules/generalEntries/dtos/ICreateGeneralEntryDTO'

class GeneralEntriesRepository implements IGeneralEntriesRepository {
  private ormRepository: Repository<GeneralEntry>

  constructor() {
    this.ormRepository = getRepository(GeneralEntry)
  }

  public async findById(id: string): Promise<GeneralEntry | undefined> {
    const findEntry = await this.ormRepository.findOne({
      where: { id },
    })

    return findEntry
  }

  public async findByDate(date: Date): Promise<GeneralEntry[] | undefined> {
    const findEntry = await this.ormRepository.find({ where: { date } })

    return findEntry
  }

  public async create({
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
  }: ICreateGeneralEntryDTO): Promise<GeneralEntry> {
    const generalEntry = this.ormRepository.create({
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

    await this.ormRepository.save(generalEntry)

    return generalEntry
  }

  public async save(generalEntry: GeneralEntry): Promise<GeneralEntry> {
    return this.ormRepository.save(generalEntry)
  }
}

export default GeneralEntriesRepository
