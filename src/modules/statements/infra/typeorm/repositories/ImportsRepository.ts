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
  }: ICreateImportDTO): Promise<Import> {
    const importation = this.ormRepository.create({
      bank_id,
      account_id,
      hash,
      start_import_date,
      end_import_date,
      created_by,
    })

    return this.ormRepository.save(importation)
  }

  public async delete(importation: Import): Promise<Import> {
    return this.ormRepository.remove(importation)
  }

  public async findAll(): Promise<Import[] | undefined> {
    return this.ormRepository.find()
  }

  public async findById(id: string): Promise<Import | undefined> {
    const findImport = await this.ormRepository.findOne({
      where: { id },
    })

    return findImport
  }

  public async findByHash(hash: string): Promise<Import | undefined> {
    const findImport = await this.ormRepository.findOne({
      where: { hash },
    })

    return findImport
  }
}

export default ImportsRepository
