import { Router } from 'express'

import GeneralEntriesController from '@modules/generalEntries/infra/http/controllers/GeneralEntriesController'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const generalEntriesRouter = Router()
const generalEntriesController = new GeneralEntriesController()

generalEntriesRouter.use(ensureAuthenticated)

generalEntriesRouter.post('/', generalEntriesController.create)

generalEntriesRouter.post(
  '/link_statement',
  generalEntriesController.linkStatement,
)

export default generalEntriesRouter
