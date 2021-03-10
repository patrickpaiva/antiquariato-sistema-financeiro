import GeneralEntry from '@modules/generalEntries/infra/typeorm/entities/GeneralEntry'
import IGeneralEntriesRepository from '@modules/generalEntries/repositories/IGeneralEntriesRepository'
import { injectable, inject } from 'tsyringe'
import IFilterParamsDTO from '../dtos/IFilterParamsDTO'

@injectable()
class ListAllGeneralEntriesService {
  constructor(
    @inject('GeneralEntriesRepository')
    private generalEntriesRepository: IGeneralEntriesRepository,
  ) {}

  public async execute(params?: IFilterParamsDTO): Promise<GeneralEntry[]> {
    let generalEntries
    if (params) {
      generalEntries = await this.generalEntriesRepository.findAll(params)
    } else {
      generalEntries = await this.generalEntriesRepository.findAll()
    }

    if (!generalEntries) {
      throw new Error('Cound not load General Entries')
    }

    return generalEntries
  }
}

export default ListAllGeneralEntriesService
