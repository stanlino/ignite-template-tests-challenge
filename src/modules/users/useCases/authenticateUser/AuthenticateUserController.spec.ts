import { hash } from "bcryptjs"
import { Connection, createConnection } from "typeorm"
import { v4 as uuid } from 'uuid';
import request from 'supertest';
import { app } from "../../../../app";

let connection: Connection

describe('Authenticate user controller', () => {
  beforeAll(async () => {
    connection = await createConnection()

    await connection.runMigrations();

    const id = uuid();
    const password = await hash('123456', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
        values('${id}', 'jonas', 'jonas@gmail.com', '${password}', 'now()', 'now()')
      `,
    );
  })

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('should be able to authenticate an user', async() => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'jonas@gmail.com',
      password: '123456',
    });

    const { token } = responseToken.body;

    expect(token).toBeTruthy()
  })

  it('should not be able to authenticate an user with a incorrect password', async() => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'jonas@gmail.com',
      password: 'banana',
    });

    const { statusCode } = responseToken;

    expect(statusCode).toBe(401)
  })
})
