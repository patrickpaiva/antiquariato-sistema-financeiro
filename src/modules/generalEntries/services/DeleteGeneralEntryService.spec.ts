import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import CreateUserService from '@modules/users/services/CreateUserService'
import { v4 as uuid } from 'uuid'
import FakeGeneralEntriesRepository from '../repositories/fakes/FakeGeneralEntriesRepository'
import CreateGeneralEntryService from './CreateGeneralEntryService'
import DeleteGeneralEntryService from './DeleteGeneralEntryService'
import ListAllGeneralEntriesService from './ListAllGeneralEntriesService'

let fakeGeneralEntriesRepository: FakeGeneralEntriesRepository
let createGeneralEntry: CreateGeneralEntryService
let deleteGeneralEntry: DeleteGeneralEntryService
let listAllGeneralEntries: ListAllGeneralEntriesService

let fakeUsersRepository: FakeUsersRepository
let createUser: CreateUserService

describe('CreateGeneralEntry', () => {
  beforeEach(() => {
    fakeGeneralEntriesRepository = new FakeGeneralEntriesRepository()
    fakeUsersRepository = new FakeUsersRepository()

    createGeneralEntry = new CreateGeneralEntryService(
      fakeGeneralEntriesRepository,
    )

    createUser = new CreateUserService(fakeUsersRepository)

    deleteGeneralEntry = new DeleteGeneralEntryService(
      fakeGeneralEntriesRepository,
      fakeUsersRepository,
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
      statement_id: uuid(),
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
})
