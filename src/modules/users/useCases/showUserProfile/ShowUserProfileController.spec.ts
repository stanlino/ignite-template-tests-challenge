import { hash } from "bcryptjs"
import { Connection, createConnection } from "typeorm"
import { v4 as uuid } from 'uuid';
import request from 'supertest';
import { app } from "../../../../app";

let connection: Connection

describe('Show user profile controller', () => {
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

  it('should show the user profile', async() => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'jonas@gmail.com',
      password: '123456',
    });

    const { token } = responseToken.body;

    const response = await request(app).get(`/api/v1/profile`).set({
      authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
  })

  it('should not show the user profile with out token', async() => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'jonas@gmail.com',
      password: '123456',
    });

    const { token } = responseToken.body;

    const response = await request(app).get(`/api/v1/profile`);

    expect(response.status).toBe(401)
  })
})
