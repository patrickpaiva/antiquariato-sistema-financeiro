import IGeneralEntriesRepository from '@modules/generalEntries/repositories/IGeneralEntriesRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
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

    const deletedEntry = {
      ...findEntry,
      deleted: true,
      deleted_by: userId,
      deleted_date: new Date(),
    }

    await this.generalEntriesRepository.update(deletedEntry)
  }
}

export default DeleteGeneralEntryService
