import IGeneralEntriesRepository from '@modules/generalEntries/repositories/IGeneralEntriesRepository'
import UnlinkGeneralEntryToStatementService from '@modules/generalEntries/services/UnlinkGeneralEntryToStatementService'
import IStatementRepository from '@modules/statements/repositories/IStatementsRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { validate } from 'uuid'
// import { validate } from 'uuid'

interface IRequest {
  statementId: string
  userId: string
}

@injectable()
class DeleteStatementService {
  constructor(
    @inject('GeneralEntriesRepository')
    private generalEntriesRepository: IGeneralEntriesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementRepository,
  ) {}

  public async execute({ statementId, userId }: IRequest): Promise<void> {
    const findStatement = await this.statementsRepository.findById(statementId)
    const findUser = await this.usersRepository.findById(userId)

    if (!findUser) {
      throw new AppError('User not found', 404)
    }

    if (!findStatement) {
      throw new AppError('Statement not found', 404)
    }

    if (!findStatement.created_manually) {
      throw new AppError(
        'Only statements that were created manually can be deleted',
      )
    }

    if (findStatement.entry_id && validate(findStatement.entry_id)) {
      const unlinkGeneralEntryToStatementService = new UnlinkGeneralEntryToStatementService(
        this.generalEntriesRepository,
        this.statementsRepository,
      )

      await unlinkGeneralEntryToStatementService.execute({
        id: findStatement.entry_id,
        statement_id: findStatement.id,
      })
    }

    const deletedStatement = {
      ...findStatement,
      entry_id: null,
      deleted: true,
      deleted_by: userId,
      deleted_date: new Date(),
    }

    await this.statementsRepository.update(deletedStatement)
  }
}

export default DeleteStatementService
