import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateAccountService from '@modules/accounts/services/CreateAccountService'
import ListAccountsService from '@modules/accounts/services/ListAccountsService'
import DeleteAccountService from '@modules/accounts/services/DeleteAccountService'
import UpdateAccountService from '@modules/accounts/services/UpdateAccountService'

export default class AccountsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      bank_number,
      agency_number,
      account_number,
      account_type,
      bank_name,
    } = request.body

    const createAccount = container.resolve(CreateAccountService)

    const account = await createAccount.execute({
      bank_number,
      agency_number,
      account_number,
      account_type,
      bank_name,
    })

    return response.json(account)
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const listAccounts = container.resolve(ListAccountsService)

    const accounts = await listAccounts.execute(request.body)

    return response.json(accounts)
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const deleteAccount = container.resolve(DeleteAccountService)

    await deleteAccount.execute(request.body)

    return response.json({ message: 'Deleted Successfully' })
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const updateAccount = container.resolve(UpdateAccountService)

    const account = await updateAccount.execute(request.body)

    return response.json(account)
  }
}
