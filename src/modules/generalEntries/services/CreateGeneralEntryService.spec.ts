import { uuid } from 'uuidv4'
import FakeGeneralEntriesRepository from '../repositories/fakes/FakeGeneralEntriesRepository'
import CreateGeneralEntryService from './CreateGeneralEntryService'

describe('CreateGeneralEntry', () => {
  it('should be able to create a new General Entry', async () => {
    const fakeGeneralEntriesRepository = new FakeGeneralEntriesRepository()
    const createGeneralEntry = new CreateGeneralEntryService(
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

    const generalEntry = await createGeneralEntry.execute(data)

    expect(generalEntry).toHaveProperty('id')
    expect(generalEntry.value).toBe(5000)
  })
})
