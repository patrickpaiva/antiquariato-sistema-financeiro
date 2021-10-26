import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateUserService from '@modules/users/services/CreateUserService'
import ListUsersService from '@modules/users/services/ListUsersService'
import DeleteUserService from '@modules/users/services/DeleteUserService'

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, level, password } = request.body

    const createUser = container.resolve(CreateUserService)

    const user = await createUser.execute({
      name,
      email,
      level,
      password,
    })

    delete user.password

    return response.json(user)
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const listUsers = container.resolve(ListUsersService)

    const users = await listUsers.execute(request.body)

    return response.json(users)
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const deleteUser = container.resolve(DeleteUserService)

    await deleteUser.execute(request.body)

    return response.json({ message: 'Deleted Successfully' })
  }
}
