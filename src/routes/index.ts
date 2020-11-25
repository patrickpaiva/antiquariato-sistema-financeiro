import { Router } from 'express'
import generalEntriesRouter from './generalEntries.routes'
const routes = Router()

routes.use('/general_entries', generalEntriesRouter)

export default routes
