import IGeneralEntriesRepository from '@modules/generalEntries/repositories/IGeneralEntriesRepository'
import { inject, injectable } from 'tsyringe'

@injectable()
class DeleteGeneralEntryService {
  constructor(
    @inject('GeneralEntriesRepository')
    private generalEntriesRepository: IGeneralEntriesRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const findEntry = await this.generalEntriesRepository.findById(id)

    if (!findEntry) {
      throw new Error('User not found')
    } else {
      await this.generalEntriesRepository.delete(findEntry)
    }
  }
}

export default DeleteGeneralEntryService
