import { hash } from "bcryptjs"
import { Connection, createConnection } from "typeorm"
import { v4 as uuid } from 'uuid';
import request from 'supertest';
import { app } from "../../../../app";

let connection: Connection

describe('Create user controller', () => {
  beforeAll(async () => {
    connection = await createConnection()

    await connection.runMigrations();
  })

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('should be able to create a user', async() => {
    const response = await request(app).post('/api/v1/users').send({
      email: 'jonas@gmail.com',
      password: '123456',
      name: 'Jonas'
    });

    const { statusCode } = response;

    expect(statusCode).toBe(201)
  })

  it('should not be able to create a user with a email already exists', async() => {

    await request(app).post('/api/v1/users').send({
      email: 'jonas@gmail.com',
      password: '123456',
      name: 'Jonas'
    });

    const response = await request(app).post('/api/v1/users').send({
      email: 'jonas@gmail.com',
      password: '123456',
      name: 'Jonas'
    });

    const { statusCode } = response;

    expect(statusCode).toBe(400)
  })
})
