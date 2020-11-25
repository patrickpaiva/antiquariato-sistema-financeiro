import GeneralEntry from '../models/GeneralEntry'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(GeneralEntry)
class GeneralEntriesRepository extends Repository<GeneralEntry> {}

export default GeneralEntriesRepository
