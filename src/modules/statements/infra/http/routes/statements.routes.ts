import { Router } from 'express'

import StatementsController from '@modules/statements/infra/http/controllers/StatementsController'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const statementsRouter = Router()
const statementsController = new StatementsController()

statementsRouter.use(ensureAuthenticated)

statementsRouter.post('/', statementsController.create)

export default statementsRouter
