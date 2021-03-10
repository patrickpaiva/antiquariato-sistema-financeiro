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
class LinkGeneralEntryToStatementService {
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

    if (statement.entry_id !== null || entry.statement_id !== null) {
      throw new AppError('Statement or entry already linked')
    }

    if (statement.date !== entry.date) {
      throw new AppError('Date does not match, please check your request')
    }

    if (statement.transaction_type !== entry.type) {
      throw new AppError('Type does not match, please check your request')
    }

    if (statement.value !== entry.value) {
      throw new AppError('Value does not match, please check your request')
    }

    entry.statement_id = statement_id
    statement.entry_id = id

    await this.generalEntriesRepository.update(entry)
    await this.statementsRepository.save(statement)

    return entry
  }
}

export default LinkGeneralEntryToStatementService
