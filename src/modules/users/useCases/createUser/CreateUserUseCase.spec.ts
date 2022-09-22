import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"

let imMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Create user', () => {
  beforeEach(() => {
    imMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(imMemoryUsersRepository)
  })

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'test',
      password: '123456'
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user if the email already exists', async () => {
    await createUserUseCase.execute({
      email: 'test@test.com.br',
      name: 'test',
      password: '123456'
    })

    expect(async() => {
      await createUserUseCase.execute({
        email: 'test@test.com.br',
        name: 'test',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
