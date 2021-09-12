import IStatementsRepository from '@modules/statements/repositories/IStatementsRepository'
import { injectable, inject } from 'tsyringe'
import IImportsRepository from '../repositories/IImportsRepository'
import UnlinkGeneralEntryToStatementService from '@modules/generalEntries/services/UnlinkGeneralEntryToStatementService'
import IGeneralEntriesRepository from '@modules/generalEntries/repositories/IGeneralEntriesRepository'
import { validate } from 'uuid'

@injectable()
class UnDoImportStatementesService {
  constructor(
    @inject('GeneralEntriesRepository')
    private generalEntriesRepository: IGeneralEntriesRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
    @inject('ImportsRepository')
    private importsRepository: IImportsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const findImport = await this.importsRepository.findById(id)
    const findStatements = await this.statementsRepository.findAll({
      import_id: id,
    })

    findStatements?.map(async item => {
      if (item.entry_id && validate(item.entry_id)) {
        const unlinkGeneralEntryToStatementService =
          new UnlinkGeneralEntryToStatementService(
            this.generalEntriesRepository,
            this.statementsRepository,
          )

        await unlinkGeneralEntryToStatementService.execute({
          id: item.entry_id,
          statement_id: item.id,
        })
      }
    })

    if (findStatements && findImport) {
      await this.statementsRepository.hardRemove(findStatements)
      await this.importsRepository.delete(findImport)
    }
  }
}

export { UnDoImportStatementesService }
