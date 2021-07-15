import ICreateImportDTO from '@modules/statements/dtos/ICreateImportDTO'
import IImportRepository from '@modules/statements/repositories/IImportsRepository'
import { getRepository, Repository } from 'typeorm'
import Import from '../entities/Imports'

class ImportsRepository implements IImportRepository {
  private ormRepository: Repository<Import>

  constructor() {
    this.ormRepository = getRepository(Import)
  }

  public async create({
    bank_id,
    account_id,
    hash,
    start_import_date,
    end_import_date,
    created_by,
  }: ICreateImportDTO): Promise<void> {
    const importation = this.ormRepository.create({
      bank_id,
      account_id,
      hash,
      start_import_date,
      end_import_date,
      created_by,
    })

    await this.ormRepository.save(importation)
  }

  public async findAll(): Promise<Import[] | undefined> {
    return this.ormRepository.find()
  }
}

export default ImportsRepository
