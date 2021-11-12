import { Router } from 'express'

import UsersController from '@modules/users/infra/http/controllers/UsersController'

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const usersRouter = Router()
const usersController = new UsersController()

usersRouter.use(ensureAuthenticated)

usersRouter.get('/', usersController.show)
usersRouter.post('/', usersController.create)
usersRouter.delete('/', usersController.delete)
usersRouter.put('/', usersController.update)

export default usersRouter
