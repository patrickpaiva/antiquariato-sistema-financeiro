import GeneralEntry from '@modules/generalEntries/infra/typeorm/entities/GeneralEntry'
import IGeneralEntriesRepository from '@modules/generalEntries/repositories/IGeneralEntriesRepository'
import { injectable, inject } from 'tsyringe'

@injectable()
class ListAllGeneralEntriesService {
  constructor(
    @inject('GeneralEntriesRepository')
    private generalEntriesRepository: IGeneralEntriesRepository,
  ) {}

  public async execute(): Promise<GeneralEntry[]> {
    const generalEntries = await this.generalEntriesRepository.findAll()

    if (!generalEntries) {
      throw new Error('Cound not load General Entries')
    }

    return generalEntries
  }
}

export default ListAllGeneralEntriesService
