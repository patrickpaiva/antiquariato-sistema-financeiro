import FakeGeneralEntriesRepository from '@modules/generalEntries/repositories/fakes/FakeGeneralEntriesRepository'
import CreateGeneralEntryService from '@modules/generalEntries/services/CreateGeneralEntryService'
import LinkGeneralEntryToStatementService from '@modules/generalEntries/services/LinkGeneralEntryToStatementService'
import ListAllGeneralEntriesService from '@modules/generalEntries/services/ListAllGeneralEntriesService'
import FakeStatementsRepository from '@modules/statements/repositories/fakes/FakeStatementsRepository'
import CreateStatementService from '@modules/statements/services/CreateStatementService'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import CreateUserService from '@modules/users/services/CreateUserService'
import { v4 as uuid } from 'uuid'
import DeleteStatementService from './DeleteStatementService'
import ListStatementsService from './ListStatementsService'

let fakeGeneralEntriesRepository: FakeGeneralEntriesRepository
let fakeStatementsRepository: FakeStatementsRepository
let createGeneralEntry: CreateGeneralEntryService
let deleteStatement: DeleteStatementService
let listAllStatements: ListStatementsService
let listAllGeneralEntries: ListAllGeneralEntriesService

let fakeUsersRepository: FakeUsersRepository
let createUser: CreateUserService
let createStatement: CreateStatementService

describe('DeleteStatement', () => {
  beforeEach(() => {
    fakeGeneralEntriesRepository = new FakeGeneralEntriesRepository()
    fakeUsersRepository = new FakeUsersRepository()
    fakeStatementsRepository = new FakeStatementsRepository()

    createGeneralEntry = new CreateGeneralEntryService(
      fakeGeneralEntriesRepository,
    )

    createUser = new CreateUserService(fakeUsersRepository)

    createStatement = new CreateStatementService(fakeStatementsRepository)

    deleteStatement = new DeleteStatementService(
      fakeGeneralEntriesRepository,
      fakeUsersRepository,
      fakeStatementsRepository,
    )

    listAllStatements = new ListStatementsService(fakeStatementsRepository)

    listAllGeneralEntries = new ListAllGeneralEntriesService(
      fakeGeneralEntriesRepository,
    )
  })
  it('should be able to delete a Statement', async () => {
    const newUser = {
      name: 'Patrick',
      email: 'teste@teste.com',
      level: 2,
      password: '123456',
    }

    const fakeUser = await createUser.execute(newUser)

    const fakeStatement = await createStatement.execute({
      date: new Date(),
      bank_id: 104,
      account_id: 200376,
      transaction_type: 'DEBIT',
      value: 5000,
      transaction_history: '33',
      transaction_method: 'BOLETO',
      created_by: fakeUser.id,
    })

    const deleteData = {
      statementId: fakeStatement.id,
      userId: fakeUser.id,
    }

    await deleteStatement.execute(deleteData)

    const statementsList = await listAllStatements.execute()

    expect(statementsList[0].deleted).toBe(true)
    expect(statementsList[0].deleted_by).toBe(deleteData.userId)
  })
  it('should be able to delete a Statement that is linked to an entry and unlink then', async () => {
    const linkGeneralEntryToStatementService = new LinkGeneralEntryToStatementService(
      fakeGeneralEntriesRepository,
      fakeStatementsRepository,
    )

    const newUser = {
      name: 'Patrick',
      email: 'teste@teste.com',
      level: 2,
      password: '123456',
    }

    const fakeUser = await createUser.execute(newUser)

    const fakeDate = new Date()

    const fakeStatement = await createStatement.execute({
      date: fakeDate,
      bank_id: 104,
      account_id: 200376,
      transaction_type: 'DEBIT',
      value: 5000,
      transaction_history: '33',
      transaction_method: 'BOLETO',
      created_by: fakeUser.id,
    })

    const newGeneralEntry = {
      date: fakeDate,
      description: 'Descrição de Teste',
      value: 5000,
      type: 'DEBIT',
      status: 'A Pagar',
      cost_center: 'Centro de custo de teste',
      presentation_rubric: 'Rubrica de Apresentação de teste',
      specific_rubric: 'Rubrica Especifica de Teste',
      statement_id: undefined,
      created_by: uuid(),
      authorized_by: uuid(),
    }

    const fakeEntry = await createGeneralEntry.execute(newGeneralEntry)

    await linkGeneralEntryToStatementService.execute({
      id: fakeEntry.id,
      statement_id: fakeStatement.id,
    })

    const deleteData = {
      statementId: fakeStatement.id,
      userId: fakeUser.id,
    }

    await deleteStatement.execute(deleteData)

    const statementsList = await listAllStatements.execute()
    const generalEntriesList = await listAllGeneralEntries.execute()

    expect(statementsList[0].deleted).toBe(true)
    expect(statementsList[0].deleted_by).toBe(deleteData.userId)
    expect(statementsList[0].entry_id).toBe(null)
    expect(generalEntriesList[0].statement_id).toBe(null)
  })
})
