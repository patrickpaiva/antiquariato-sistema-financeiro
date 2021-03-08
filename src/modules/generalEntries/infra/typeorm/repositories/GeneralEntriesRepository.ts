import GeneralEntry from '@modules/generalEntries/infra/typeorm/entities/GeneralEntry'
import { Between, getRepository, MoreThan, Repository } from 'typeorm'

import IGeneralEntriesRepository from '@modules/generalEntries/repositories/IGeneralEntriesRepository'
import ICreateGeneralEntryDTO from '@modules/generalEntries/dtos/ICreateGeneralEntryDTO'
import IFilterParamsDTO from '@modules/generalEntries/dtos/IFilterParamsDTO'

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

  public async findAll(
    params: IFilterParamsDTO,
  ): Promise<GeneralEntry[] | undefined> {
    if (Object.keys(params).length === 0) {
      const generalEntries = await this.ormRepository.find({
        order: {
          date: 'DESC',
        },
      })
      return generalEntries
    } else {
      const generalEntries = await this.ormRepository.find({
        order: {
          date: 'DESC',
        },
        where: {
          date: Between(
            params.minDate || '2000-01-01',
            params.maxDate || '2100-01-01',
          ),
        },
      })

      return generalEntries
    }
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

  public async update(generalEntry: GeneralEntry): Promise<void> {
    await this.ormRepository.save(generalEntry)
  }

  public async delete(generalEntry: GeneralEntry): Promise<void> {
    await this.ormRepository.remove(generalEntry)
  }
}

export default GeneralEntriesRepository
