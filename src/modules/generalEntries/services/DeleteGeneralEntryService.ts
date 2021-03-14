import IGeneralEntriesRepository from '@modules/generalEntries/repositories/IGeneralEntriesRepository'
import UnlinkGeneralEntryToStatementService from '@modules/generalEntries/services/UnlinkGeneralEntryToStatementService'
import IStatementRepository from '@modules/statements/repositories/IStatementsRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { validate } from 'uuid'
// import { validate } from 'uuid'

interface IRequest {
  generalEntryId: string
  userId: string
}

@injectable()
class DeleteGeneralEntryService {
  constructor(
    @inject('GeneralEntriesRepository')
    private generalEntriesRepository: IGeneralEntriesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementRepository,
  ) {}

  public async execute({ generalEntryId, userId }: IRequest): Promise<void> {
    const findEntry = await this.generalEntriesRepository.findById(
      generalEntryId,
    )
    const findUser = await this.usersRepository.findById(userId)

    if (!findUser) {
      throw new AppError('User not found', 404)
    }

    if (!findEntry) {
      throw new AppError('General Entry not found', 404)
    }

    // if (findEntry.statement_id && validate(findEntry.statement_id)) {
    //   throw new AppError(
    //     'Cannot delete a general entry which is linked to a statement',
    //   )
    // }

    if (findEntry.statement_id && validate(findEntry.statement_id)) {
      // const unlinkGeneralEntryToStatementService = container.resolve(
      //   UnlinkGeneralEntryToStatementService,
      // )

      const unlinkGeneralEntryToStatementService = new UnlinkGeneralEntryToStatementService(
        this.generalEntriesRepository,
        this.statementsRepository,
      )

      await unlinkGeneralEntryToStatementService.execute({
        id: findEntry.id,
        statement_id: findEntry.statement_id,
      })
    }

    const deletedEntry = {
      ...findEntry,
      statement_id: undefined,
      deleted: true,
      deleted_by: userId,
      deleted_date: new Date(),
    }

    await this.generalEntriesRepository.update(deletedEntry)
  }
}

export default DeleteGeneralEntryService
