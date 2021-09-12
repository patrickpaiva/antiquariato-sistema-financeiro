import Import from '@modules/statements/infra/typeorm/entities/Imports'
import ICreateImportDTO from '../dtos/ICreateImportDTO'

export default interface IImportRepository {
  create(data: ICreateImportDTO): Promise<Import>
  delete(importation: Import): Promise<Import>
  findAll(): Promise<Import[] | undefined>
  findById(id: string): Promise<Import | undefined>
  findByHash(hash: string): Promise<Import | undefined>
}
