import { hash } from "bcryptjs";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase

describe('Show user profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able show the user profile', async () => {
    const passwordHash = await hash('123456', 8);
    const email = 'test@test.com.br'

    const createUser = await inMemoryUsersRepository.create({
      email,
      name: 'test',
      password: passwordHash,
    })

    const user = await showUserProfileUseCase.execute(createUser.id!)

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
  })

  it('should not be able show the user profile with a incorrect id', () => {
    expect(async () => {
      await showUserProfileUseCase.execute('banana')
    }).rejects.toBeInstanceOf(AppError)
  })
})
