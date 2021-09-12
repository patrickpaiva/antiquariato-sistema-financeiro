import { Router } from 'express'
import multer from 'multer'

import StatementsController from '@modules/statements/infra/http/controllers/StatementsController'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const statementsRouter = Router()

const upload = multer({
  dest: './tmp',
})

const statementsController = new StatementsController()

statementsRouter.use(ensureAuthenticated)

statementsRouter.get('/', statementsController.show)
statementsRouter.post('/', statementsController.create)
statementsRouter.put('/', statementsController.update)
statementsRouter.delete('/', statementsController.delete)

statementsRouter.post(
  '/import',
  upload.single('file'),
  statementsController.import,
)

statementsRouter.delete('/import', statementsController.unDoImport)

export default statementsRouter
