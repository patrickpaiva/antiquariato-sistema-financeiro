import GeneralEntry from '@modules/generalEntries/infra/typeorm/entities/GeneralEntry'
import ICreateGeneralEntryDTO from '@modules/generalEntries/dtos/ICreateGeneralEntryDTO'

interface IGeneralEntriesRepository {
  findByDate(date: Date): Promise<GeneralEntry[] | undefined>
  findById(id: string): Promise<GeneralEntry | undefined>
  create(data: ICreateGeneralEntryDTO): Promise<GeneralEntry>
  update(data: GeneralEntry): Promise<void>
}

export default IGeneralEntriesRepository
