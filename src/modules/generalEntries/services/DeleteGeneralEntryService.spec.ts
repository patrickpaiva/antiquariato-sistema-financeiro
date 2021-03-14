import FakeStatementsRepository from '@modules/statements/repositories/fakes/FakeStatementsRepository'
import CreateStatementService from '@modules/statements/services/CreateStatementService'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import CreateUserService from '@modules/users/services/CreateUserService'
import AppError from '@shared/errors/AppError'
import { v4 as uuid } from 'uuid'
import FakeGeneralEntriesRepository from '../repositories/fakes/FakeGeneralEntriesRepository'
import CreateGeneralEntryService from './CreateGeneralEntryService'
import DeleteGeneralEntryService from './DeleteGeneralEntryService'
import LinkGeneralEntryToStatementService from './LinkGeneralEntryToStatementService'
import ListAllGeneralEntriesService from './ListAllGeneralEntriesService'

let fakeGeneralEntriesRepository: FakeGeneralEntriesRepository
let fakeStatementsRepository: FakeStatementsRepository
let createGeneralEntry: CreateGeneralEntryService
let deleteGeneralEntry: DeleteGeneralEntryService
let listAllGeneralEntries: ListAllGeneralEntriesService

let fakeUsersRepository: FakeUsersRepository
let createUser: CreateUserService
let createStatement: CreateStatementService

describe('CreateGeneralEntry', () => {
  beforeEach(() => {
    fakeGeneralEntriesRepository = new FakeGeneralEntriesRepository()
    fakeUsersRepository = new FakeUsersRepository()
    fakeStatementsRepository = new FakeStatementsRepository()

    createGeneralEntry = new CreateGeneralEntryService(
      fakeGeneralEntriesRepository,
    )

    createUser = new CreateUserService(fakeUsersRepository)

    createStatement = new CreateStatementService(fakeStatementsRepository)

    deleteGeneralEntry = new DeleteGeneralEntryService(
      fakeGeneralEntriesRepository,
      fakeUsersRepository,
      fakeStatementsRepository,
    )

    listAllGeneralEntries = new ListAllGeneralEntriesService(
      fakeGeneralEntriesRepository,
    )
  })
  it('should be able to delete a General Entry', async () => {
    const newUser = {
      name: 'Patrick',
      email: 'teste@teste.com',
      level: 2,
      password: '123456',
    }

    const fakeUser = await createUser.execute(newUser)

    const newGeneralEntry = {
      date: new Date(),
      description: 'Descrição de Teste',
      value: 5000,
      type: 'Tipo Teste',
      status: 'A Pagar',
      cost_center: 'Centro de custo de teste',
      presentation_rubric: 'Rubrica de Apresentação de teste',
      specific_rubric: 'Rubrica Especifica de Teste',
      statement_id: undefined,
      created_by: uuid(),
      authorized_by: uuid(),
    }

    const firstEntry = await createGeneralEntry.execute(newGeneralEntry)

    const deleteData = {
      generalEntryId: firstEntry.id,
      userId: fakeUser.id,
    }

    await deleteGeneralEntry.execute(deleteData)

    const generalEntriesList = await listAllGeneralEntries.execute()

    expect(generalEntriesList[0].deleted).toBe(true)
    expect(generalEntriesList[0].deleted_by).toBe(deleteData.userId)
  })
  it('should not be able to delete a General Entry with a invalid User', async () => {
    const newGeneralEntry = {
      date: new Date(),
      description: 'Descrição de Teste',
      value: 5000,
      type: 'Tipo Teste',
      status: 'A Pagar',
      cost_center: 'Centro de custo de teste',
      presentation_rubric: 'Rubrica de Apresentação de teste',
      specific_rubric: 'Rubrica Especifica de Teste',
      statement_id: undefined,
      created_by: uuid(),
      authorized_by: uuid(),
    }

    const firstEntry = await createGeneralEntry.execute(newGeneralEntry)

    const deleteData = {
      generalEntryId: firstEntry.id,
      userId: uuid(),
    }

    await expect(deleteGeneralEntry.execute(deleteData)).rejects.toBeInstanceOf(
      AppError,
    )
  })
  it('should not be able to delete a General Entry with invalid Id', async () => {
    const newUser = {
      name: 'Patrick',
      email: 'teste@teste.com',
      level: 2,
      password: '123456',
    }

    const fakeUser = await createUser.execute(newUser)

    const deleteData = {
      generalEntryId: uuid(),
      userId: fakeUser.id,
    }

    await expect(deleteGeneralEntry.execute(deleteData)).rejects.toBeInstanceOf(
      AppError,
    )
  })
  it('should be able to delete a General Entry which is linked to a statement', async () => {
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

    const linkedEntry = await linkGeneralEntryToStatementService.execute({
      id: fakeEntry.id,
      statement_id: fakeStatement.id,
    })

    const deleteData = {
      generalEntryId: linkedEntry.id,
      userId: fakeUser.id,
    }

    await deleteGeneralEntry.execute(deleteData)

    const generalEntriesList = await listAllGeneralEntries.execute()

    expect(generalEntriesList[0].deleted).toBe(true)
    expect(generalEntriesList[0].deleted_by).toBe(deleteData.userId)
  })
})
