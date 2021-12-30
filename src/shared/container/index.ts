import { container } from 'tsyringe'

import IGeneralEntriesRepository from '@modules/generalEntries/repositories/IGeneralEntriesRepository'
import GeneralEntriesRepository from '@modules/generalEntries/infra/typeorm/repositories/GeneralEntriesRepository'

import IStatementsRepository from '@modules/statements/repositories/IStatementsRepository'
import StatementsRepository from '@modules/statements/infra/typeorm/repositories/StatementsRepository'

import IImportsRepository from '@modules/statements/repositories/IImportsRepository'
import ImportsRepository from '@modules/statements/infra/typeorm/repositories/ImportsRepository'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'

import IAccountsRepository from '@modules/accounts/repositories/IAccountsRepository'
import AccountsRepository from '@modules/accounts/infra/typeorm/repositories/AccountsRepository'

container.registerSingleton<IGeneralEntriesRepository>(
  'GeneralEntriesRepository',
  GeneralEntriesRepository,
)

container.registerSingleton<IStatementsRepository>(
  'StatementsRepository',
  StatementsRepository,
)

container.registerSingleton<IImportsRepository>(
  'ImportsRepository',
  ImportsRepository,
)

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
)

container.registerSingleton<IAccountsRepository>(
  'AccountsRepository',
  AccountsRepository,
)
