import { Router } from 'express'

import StatementsController from '@modules/statements/infra/http/controllers/StatementsController'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const statementsRouter = Router()
const statementsController = new StatementsController()

statementsRouter.use(ensureAuthenticated)

statementsRouter.get('/', statementsController.show)
statementsRouter.post('/', statementsController.create)
statementsRouter.delete('/', statementsController.delete)

export default statementsRouter
