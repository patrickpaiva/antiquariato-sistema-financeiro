import { Router } from 'express'

import GeneralEntriesController from '@modules/generalEntries/infra/http/controllers/GeneralEntriesController'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const generalEntriesRouter = Router()
const generalEntriesController = new GeneralEntriesController()

generalEntriesRouter.use(ensureAuthenticated)

generalEntriesRouter.get('/', generalEntriesController.show)

generalEntriesRouter.post('/', generalEntriesController.create)

generalEntriesRouter.put('/', generalEntriesController.update)

generalEntriesRouter.post(
  '/link_statement',
  generalEntriesController.linkStatement,
)

generalEntriesRouter.post(
  '/unlink_statement',
  generalEntriesController.unlinkStatement,
)

export default generalEntriesRouter
