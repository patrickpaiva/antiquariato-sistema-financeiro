import GeneralEntry from '@modules/generalEntries/infra/typeorm/entities/GeneralEntry'
import { injectable, inject } from 'tsyringe'

import IGeneralEntriesRepository from '@modules/generalEntries/repositories/IGeneralEntriesRepository'
import IStatementsRepository from '@modules/statements/repositories/IStatementsRepository'

import AppError from '@shared/errors/AppError'

interface Request {
  id: string
  statement_id: string
}

@injectable()
class UnlinkGeneralEntryToStatementService {
  constructor(
    @inject('GeneralEntriesRepository')
    private generalEntriesRepository: IGeneralEntriesRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
  ) {}

  public async execute({ id, statement_id }: Request): Promise<GeneralEntry> {
    const entry = await this.generalEntriesRepository.findById(id)

    if (!entry) {
      throw new AppError('Entry not found')
    }

    const statement = await this.statementsRepository.findById(statement_id)

    if (!statement) {
      throw new AppError('Statement not found')
    }

    if (
      entry.statement_id !== statement.id ||
      statement.entry_id !== entry.id
    ) {
      throw new AppError('Entry and Statement not currently connected')
    }

    entry.statement_id = undefined
    statement.entry_id = undefined

    await this.generalEntriesRepository.update(entry)
    await this.statementsRepository.save(statement)

    return entry
  }
}

export default UnlinkGeneralEntryToStatementService
