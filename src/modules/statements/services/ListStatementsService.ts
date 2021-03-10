import Statement from '@modules/statements/infra/typeorm/entities/Statement'
import IStatementsRepository from '@modules/statements/repositories/IStatementsRepository'
import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'
import IFilterStatementsParamsDTO from '../dtos/IFilterStatementsParamsDTO'

@injectable()
class ListStatementsService {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
  ) {}

  public async execute(
    params: IFilterStatementsParamsDTO,
  ): Promise<Statement[]> {
    const statements = await this.statementsRepository.findAll(params)

    if (!statements) {
      throw new AppError('Could not load statements list')
    }

    return statements
  }
}

export default ListStatementsService
