import { Router } from 'express'
import { getCustomRepository } from 'typeorm'

import GeneralEntriesRepository from '../repositories/GeneralEntriesRepository'
import CreateGeneralEntryService from '../services/CreateGeneralEntryService'

const generalEntriesRouter = Router()

generalEntriesRouter.get('/', async (request, response) => {
  const generalEntriesRepository = getCustomRepository(GeneralEntriesRepository)
  const generalEntries = await generalEntriesRepository.find()

  return response.json(generalEntries)
})

generalEntriesRouter.post('/', async (request, response) => {
  try {
    const {
      date,
      description,
      value,
      type,
      status,
      cost_center,
      presentation_rubric,
      specific_rubric,
      created_by,
      authorized_by,
    } = request.body

    const createGeneralEntry = new CreateGeneralEntryService()

    const generalEntry = await createGeneralEntry.execute({
      date,
      description,
      value,
      type,
      status,
      cost_center,
      presentation_rubric,
      specific_rubric,
      created_by,
      authorized_by,
    })

    return response.json(generalEntry)
  } catch (error) {
    return response.json(error)
  }
})

export default generalEntriesRouter
