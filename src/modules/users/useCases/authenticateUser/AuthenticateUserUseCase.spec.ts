import { hash } from "bcryptjs"
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Authenticate User', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to authenticate a user', async() => {

    const passwordHash = await hash('123456', 8);
    const email = 'test@test.com.br'

    await inMemoryUsersRepository.create({
      email,
      name: 'test',
      password: passwordHash,
    })

    const { user } = await authenticateUserUseCase.execute({
      email,
      password: '123456'
    });

    expect(user).toHaveProperty('id');
  })

  it('should not be able to authenticate a user with a incorrect password', async() => {

    const passwordHash = await hash('123456', 8);
    const email = 'test@test.com.br'

    await inMemoryUsersRepository.create({
      email,
      name: 'test',
      password: passwordHash,
    })

    expect(async() => {
      await authenticateUserUseCase.execute({
        email,
        password: 'banana'
      });
    }).rejects.toBeInstanceOf(AppError)

  })

  it('should not be able to authenticate a user with out email', async() => {

    const passwordHash = await hash('123456', 8);
    const email = 'test@test.com.br'

    await inMemoryUsersRepository.create({
      email,
      name: 'test',
      password: passwordHash,
    })

    expect(async() => {
      await authenticateUserUseCase.execute({
        email: '',
        password: '123456'
      });
    }).rejects.toBeInstanceOf(AppError)

  })
})
