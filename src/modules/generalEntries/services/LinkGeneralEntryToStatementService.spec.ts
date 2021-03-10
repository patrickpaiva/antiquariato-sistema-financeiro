import FakeStatementsRepository from '@modules/statements/repositories/fakes/FakeStatementsRepository'
import CreateStatementService from '@modules/statements/services/CreateStatementService'
import AppError from '@shared/errors/AppError'
import FakeGeneralEntriesRepository from '../repositories/fakes/FakeGeneralEntriesRepository'
import CreateGeneralEntryService from './CreateGeneralEntryService'
import LinkGeneralEntryToStatementService from './LinkGeneralEntryToStatementService'

let fakeGeneralEntriesRepository: FakeGeneralEntriesRepository
let fakeStatementsRepository: FakeStatementsRepository
let createGeneralEntryService: CreateGeneralEntryService
let createStatementsService: CreateStatementService
let linkGeneralEntryToStatement: LinkGeneralEntryToStatementService

describe('LinkGeneralEntryToStatement', () => {
  beforeEach(() => {
    fakeGeneralEntriesRepository = new FakeGeneralEntriesRepository()
    fakeStatementsRepository = new FakeStatementsRepository()

    createGeneralEntryService = new CreateGeneralEntryService(
      fakeGeneralEntriesRepository,
    )

    createStatementsService = new CreateStatementService(
      fakeStatementsRepository,
    )

    linkGeneralEntryToStatement = new LinkGeneralEntryToStatementService(
      fakeGeneralEntriesRepository,
      fakeStatementsRepository,
    )
  })
  it('should be able to link a General Entry to a Statement', async () => {
    const newGeneralEntry = await createGeneralEntryService.execute({
      date: new Date('2020-12-30'),
      description: 'Descricao padrao GE',
      value: 1300,
      type: 'DEBIT',
      status: 'PAID',
      cost_center: 'DIRETORIA',
      presentation_rubric: 'Despesas Diretoria',
      specific_rubric: 'Remunerações',
      statement_id: null,
      created_by: 'd1bf7c2b-657f-49f0-9694-065ba997be9b',
      authorized_by: 'd1bf7c2b-657f-49f0-9694-065ba997be9b',
    })

    const newStatement = await createStatementsService.execute({
      date: new Date('2020-12-30'),
      bank_id: 104,
      account_id: 200375,
      transaction_type: 'DEBIT',
      value: 1300,
      transaction_history: '33',
      transaction_method: 'BOLETO',
      entry_id: null,
      created_by: 'd1bf7c2b-657f-49f0-9694-065ba997be9b',
    })

    await linkGeneralEntryToStatement.execute({
      id: newGeneralEntry.id,
      statement_id: newStatement.id,
    })

    expect(newGeneralEntry).toHaveProperty('statement_id')
    expect(newStatement).toHaveProperty('entry_id')
    expect(newGeneralEntry.statement_id).toBe(newStatement.id)
    expect(newStatement.entry_id).toBe(newGeneralEntry.id)
  })
  it('should not be able to link a General Entry to a Statement with different dates', async () => {
    const newGeneralEntry = await createGeneralEntryService.execute({
      date: new Date('2020-12-31'),
      description: 'Descricao padrao GE',
      value: 1300,
      type: 'DEBIT',
      status: 'PAID',
      cost_center: 'DIRETORIA',
      presentation_rubric: 'Despesas Diretoria',
      specific_rubric: 'Remunerações',
      statement_id: null,
      created_by: 'd1bf7c2b-657f-49f0-9694-065ba997be9b',
      authorized_by: 'd1bf7c2b-657f-49f0-9694-065ba997be9b',
    })

    const newStatement = await createStatementsService.execute({
      date: new Date('2020-12-30'),
      bank_id: 104,
      account_id: 200375,
      transaction_type: 'DEBIT',
      value: 1300,
      transaction_history: '33',
      transaction_method: 'BOLETO',
      entry_id: null,
      created_by: 'd1bf7c2b-657f-49f0-9694-065ba997be9b',
    })

    await expect(
      linkGeneralEntryToStatement.execute({
        id: newGeneralEntry.id,
        statement_id: newStatement.id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
