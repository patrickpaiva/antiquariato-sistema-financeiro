import { Router } from 'express'
import generalEntriesRouter from '@modules/generalEntries/infra/http/routes/generalEntries.routes'
import statementsRouter from '@modules/statements/infra/http/routes/statements.routes'
import usersRouter from '@modules/users/infra/http/routes/users.routes'
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes'
const routes = Router()

routes.use('/general_entries', generalEntriesRouter)
routes.use('/statements', statementsRouter)
routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)

export default routes
