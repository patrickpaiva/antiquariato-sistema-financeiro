import { v4 as uuid } from 'uuid'
import FakeGeneralEntriesRepository from '../repositories/fakes/FakeGeneralEntriesRepository'
import CreateGeneralEntryService from './CreateGeneralEntryService'
import DeleteGeneralEntryService from './DeleteGeneralEntryService'
import ListAllGeneralEntriesService from './ListAllGeneralEntriesService'

describe('CreateGeneralEntry', () => {
  it('should be able to delete a General Entry', async () => {
    const fakeGeneralEntriesRepository = new FakeGeneralEntriesRepository()
    const createGeneralEntry = new CreateGeneralEntryService(
      fakeGeneralEntriesRepository,
    )
    const deleteGeneralEntry = new DeleteGeneralEntryService(
      fakeGeneralEntriesRepository,
    )

    const listAllGeneralEntries = new ListAllGeneralEntriesService(
      fakeGeneralEntriesRepository,
    )

    const data = {
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

    const firstEntry = await createGeneralEntry.execute(data)
    await createGeneralEntry.execute(data)

    await deleteGeneralEntry.execute(firstEntry.id)

    const generalEntriesList = await listAllGeneralEntries.execute()

    expect(generalEntriesList).toHaveLength(1)
  })
})
