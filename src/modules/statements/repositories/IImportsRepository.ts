import Import from '@modules/statements/infra/typeorm/entities/Imports'
import ICreateImportDTO from '../dtos/ICreateImportDTO'

export default interface IImportRepository {
  create(data: ICreateImportDTO): Promise<void>
  findAll(): Promise<Import[] | undefined>
}
