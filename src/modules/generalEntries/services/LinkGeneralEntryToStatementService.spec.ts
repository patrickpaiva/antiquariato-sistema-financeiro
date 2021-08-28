import FakeStatementsRepository from '@modules/statements/repositories/fakes/FakeStatementsRepository'
import CreateStatementService from '@modules/statements/services/CreateStatementService'
import DeleteStatementService from '@modules/statements/services/DeleteStatementService'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import CreateUserService from '@modules/users/services/CreateUserService'
import AppError from '@shared/errors/AppError'
import FakeGeneralEntriesRepository from '../repositories/fakes/FakeGeneralEntriesRepository'
import CreateGeneralEntryService from './CreateGeneralEntryService'
import DeleteGeneralEntryService from './DeleteGeneralEntryService'
import LinkGeneralEntryToStatementService from './LinkGeneralEntryToStatementService'

let fakeGeneralEntriesRepository: FakeGeneralEntriesRepository
let fakeStatementsRepository: FakeStatementsRepository
let createGeneralEntryService: CreateGeneralEntryService
let createStatementsService: CreateStatementService
let linkGeneralEntryToStatement: LinkGeneralEntryToStatementService
let deleteStatement: DeleteStatementService
let fakeUsersRepository: FakeUsersRepository
let createUser: CreateUserService
let deleteGeneralEntry: DeleteGeneralEntryService

describe('LinkGeneralEntryToStatement', () => {
  beforeEach(() => {
    fakeGeneralEntriesRepository = new FakeGeneralEntriesRepository()
    fakeStatementsRepository = new FakeStatementsRepository()
    fakeUsersRepository = new FakeUsersRepository()

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

    deleteGeneralEntry = new DeleteGeneralEntryService(
      fakeGeneralEntriesRepository,
      fakeUsersRepository,
      fakeStatementsRepository,
    )

    createUser = new CreateUserService(fakeUsersRepository)

    deleteStatement = new DeleteStatementService(
      fakeGeneralEntriesRepository,
      fakeUsersRepository,
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
      transaction_document: 'BOLETO',
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
  it('should not be able to link a General Entry with invalid Id to a Statement', async () => {
    const newStatement = await createStatementsService.execute({
      date: new Date('2020-12-30'),
      bank_id: 104,
      account_id: 200375,
      transaction_type: 'DEBIT',
      value: 1300,
      transaction_history: '33',
      transaction_document: 'BOLETO',
      entry_id: null,
      created_by: 'd1bf7c2b-657f-49f0-9694-065ba997be9b',
    })

    await expect(
      linkGeneralEntryToStatement.execute({
        id: 'd1bf7c2b-657f-49f0-9694-065ba997be9b',
        statement_id: newStatement.id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to link a General Entry to a Statement with invalid Id', async () => {
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

    await expect(
      linkGeneralEntryToStatement.execute({
        id: newGeneralEntry.id,
        statement_id: 'd1bf7c2b-657f-49f0-9694-065ba997be9b',
      }),
    ).rejects.toBeInstanceOf(AppError)
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
      transaction_document: 'BOLETO',
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
  it('should not be able to link a General Entry to a Statement with different values', async () => {
    const newGeneralEntry = await createGeneralEntryService.execute({
      date: new Date('2020-12-30'),
      description: 'Descricao padrao GE',
      value: 1400,
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
      transaction_document: 'BOLETO',
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
  it('should not be able to link a General Entry to a Statement with different types', async () => {
    const newGeneralEntry = await createGeneralEntryService.execute({
      date: new Date('2020-12-31'),
      description: 'Descricao padrao GE',
      value: 1300,
      type: 'CREDIT',
      status: 'PAID',
      cost_center: 'DIRETORIA',
      presentation_rubric: 'Despesas Diretoria',
      specific_rubric: 'Remunerações',
      statement_id: null,
      created_by: 'd1bf7c2b-657f-49f0-9694-065ba997be9b',
      authorized_by: 'd1bf7c2b-657f-49f0-9694-065ba997be9b',
    })

    const newStatement = await createStatementsService.execute({
      date: new Date('2020-12-31'),
      bank_id: 104,
      account_id: 200375,
      transaction_type: 'DEBIT',
      value: 1300,
      transaction_history: '33',
      transaction_document: 'BOLETO',
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
  it('should not be able to link a General Entry to a Statement when one is already Linked', async () => {
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
      date: new Date('2020-12-31'),
      bank_id: 104,
      account_id: 200375,
      transaction_type: 'DEBIT',
      value: 1300,
      transaction_history: '33',
      transaction_document: 'BOLETO',
      entry_id: null,
      created_by: 'd1bf7c2b-657f-49f0-9694-065ba997be9b',
    })

    await linkGeneralEntryToStatement.execute({
      id: newGeneralEntry.id,
      statement_id: newStatement.id,
    })

    const anotherGeneralEntry = await createGeneralEntryService.execute({
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

    await expect(
      linkGeneralEntryToStatement.execute({
        id: anotherGeneralEntry.id,
        statement_id: newStatement.id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to link a General Entry to a deleted Statement', async () => {
    const newUser = {
      name: 'Patrick',
      email: 'teste@teste.com',
      level: 2,
      password: '123456',
    }

    const fakeUser = await createUser.execute(newUser)

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
      created_by: fakeUser.id,
      authorized_by: fakeUser.id,
    })

    const newStatement = await createStatementsService.execute({
      date: new Date('2020-12-31'),
      bank_id: 104,
      account_id: 200375,
      transaction_type: 'DEBIT',
      value: 1300,
      transaction_history: '33',
      transaction_document: 'BOLETO',
      entry_id: null,
      created_by: fakeUser.id,
    })

    const deleteData = {
      statementId: newStatement.id,
      userId: fakeUser.id,
    }

    await deleteStatement.execute(deleteData)

    await expect(
      linkGeneralEntryToStatement.execute({
        id: newGeneralEntry.id,
        statement_id: newStatement.id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to link a deleted General Entry to a Statement', async () => {
    const newUser = {
      name: 'Patrick',
      email: 'teste@teste.com',
      level: 2,
      password: '123456',
    }

    const fakeUser = await createUser.execute(newUser)

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
      created_by: fakeUser.id,
      authorized_by: fakeUser.id,
    })

    const newStatement = await createStatementsService.execute({
      date: new Date('2020-12-31'),
      bank_id: 104,
      account_id: 200375,
      transaction_type: 'DEBIT',
      value: 1300,
      transaction_history: '33',
      transaction_document: 'BOLETO',
      entry_id: null,
      created_by: fakeUser.id,
    })

    const deleteData = {
      generalEntryId: newGeneralEntry.id,
      userId: fakeUser.id,
    }

    await deleteGeneralEntry.execute(deleteData)

    await expect(
      linkGeneralEntryToStatement.execute({
        id: newGeneralEntry.id,
        statement_id: newStatement.id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
