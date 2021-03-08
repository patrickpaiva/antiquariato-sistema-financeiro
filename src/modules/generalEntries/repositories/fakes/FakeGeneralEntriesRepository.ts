import { v4 as uuid } from 'uuid'

import GeneralEntry from '@modules/generalEntries/infra/typeorm/entities/GeneralEntry'

import IGeneralEntriesRepository from '@modules/generalEntries/repositories/IGeneralEntriesRepository'
import ICreateGeneralEntryDTO from '@modules/generalEntries/dtos/ICreateGeneralEntryDTO'

class GeneralEntriesRepository implements IGeneralEntriesRepository {
  private generalEntries: GeneralEntry[] = []

  public async findById(id: string): Promise<GeneralEntry | undefined> {
    const findGeneralEntry = this.generalEntries.find(
      generalEntry => generalEntry.id === id,
    )

    return findGeneralEntry
  }

  public async findByDate(date: Date): Promise<GeneralEntry[] | undefined> {
    const findGeneralEntry = this.generalEntries.filter(
      generalEntry => generalEntry.date === date,
    )

    return findGeneralEntry
  }

  public async findAll(): Promise<GeneralEntry[] | undefined> {
    return this.generalEntries
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
    const generalEntry = new GeneralEntry()

    Object.assign(generalEntry, {
      id: uuid(),
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
    this.generalEntries.push(generalEntry)

    return generalEntry
  }

  public async update(generalEntry: GeneralEntry): Promise<void> {
    const filteredGeneralEntries = this.generalEntries.filter(
      item => item.id !== generalEntry.id,
    )

    filteredGeneralEntries.push(generalEntry)

    this.generalEntries = filteredGeneralEntries
  }

  public async delete(generalEntry: GeneralEntry): Promise<void> {
    const filteredGeneralEntries = this.generalEntries.filter(
      item => item.id !== generalEntry.id,
    )

    this.generalEntries = filteredGeneralEntries
  }
}

export default GeneralEntriesRepository
