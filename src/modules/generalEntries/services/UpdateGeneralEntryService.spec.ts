import { v4 as uuid } from 'uuid'
import FakeGeneralEntriesRepository from '../repositories/fakes/FakeGeneralEntriesRepository'
import CreateGeneralEntryService from './CreateGeneralEntryService'
import UpdateGeneralEntryService from './UpdateGeneralEntryService'

let createGeneralEntry: CreateGeneralEntryService
let updateGeneralEntry: UpdateGeneralEntryService

describe('UpdateGeneralEntry', () => {
  beforeEach(() => {
    const fakeGeneralEntriesRepository = new FakeGeneralEntriesRepository()
    createGeneralEntry = new CreateGeneralEntryService(
      fakeGeneralEntriesRepository,
    )
    updateGeneralEntry = new UpdateGeneralEntryService(
      fakeGeneralEntriesRepository,
    )
  })
  it('should be able to create a new General Entry', async () => {
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

    const generalEntry = await createGeneralEntry.execute(newGeneralEntry)

    const newUuid = uuid()
    const newDate = new Date()

    const updatedGeneralEntryData = {
      id: generalEntry.id,
      date: newDate,
      description: 'Descrição de Teste 2',
      value: 50000,
      type: 'Tipo Teste 2',
      status: 'Pago',
      cost_center: 'Centro de custo de teste 2',
      presentation_rubric: 'Rubrica de Apresentação de teste 2',
      specific_rubric: 'Rubrica Especifica de Teste 2',
      authorized_by: newUuid,
    }

    const updatedGeneralEntry = await updateGeneralEntry.execute(
      updatedGeneralEntryData,
    )

    expect(generalEntry).toHaveProperty('id')
    expect(updatedGeneralEntry.date).toBe(newDate)
    expect(updatedGeneralEntry.description).toBe('Descrição de Teste 2')
    expect(updatedGeneralEntry.value).toBe(50000)
    expect(updatedGeneralEntry.type).toBe('Tipo Teste 2')
    expect(updatedGeneralEntry.status).toBe('Pago')
    expect(updatedGeneralEntry.cost_center).toBe('Centro de custo de teste 2')
    expect(updatedGeneralEntry.presentation_rubric).toBe(
      'Rubrica de Apresentação de teste 2',
    )
    expect(updatedGeneralEntry.specific_rubric).toBe(
      'Rubrica Especifica de Teste 2',
    )
    expect(updatedGeneralEntry.authorized_by).toBe(newUuid)
  })
})
