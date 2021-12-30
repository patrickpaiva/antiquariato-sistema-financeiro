import { Router } from 'express'

import AccountsController from '@modules/accounts/infra/http/controllers/AccountsController'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const accountsRouter = Router()
const accountsController = new AccountsController()

accountsRouter.use(ensureAuthenticated)

accountsRouter.get('/', accountsController.show)
accountsRouter.post('/', accountsController.create)
accountsRouter.delete('/', accountsController.delete)
accountsRouter.put('/', accountsController.update)

export default accountsRouter
