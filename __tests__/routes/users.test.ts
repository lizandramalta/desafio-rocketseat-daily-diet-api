import { it, beforeAll, afterAll, describe, beforeEach, expect } from 'vitest'
import api from '../../src/api'
import request from 'supertest'
import { execSync } from 'child_process'

describe('Users routes', () => {
  beforeAll(async () => {
    await api.ready()
  })

  afterAll(async () => {
    await api.close()
  })

  beforeEach(() => {
    execSync('yarn run knex migrate:rollback --all')
    execSync('yarn run knex migrate:latest')
  })

  it('should be able to create a new user', async () => {
    await request(api.server)
      .post('/user/register')
      .send({
        name: 'Usuário Teste',
        email: 'teste@example.com',
        password: '1111111'
      })
      .expect(201)
  })

  it('should not to be able to create a new user if there is already a user with the same email', async () => {
    await request(api.server).post('/user/register').send({
      name: 'Usuário Teste',
      email: 'teste@example.com',
      password: '1111111'
    })
    const { text } = await request(api.server)
      .post('/user/register')
      .send({
        name: 'Usuário Teste',
        email: 'teste@example.com',
        password: '1111111'
      })
      .expect(409)
    expect(text).toEqual('Usuário já existe.')
  })

  it('should be able to login if the email and password is correct', async () => {
    await request(api.server).post('/user/register').send({
      name: 'Usuário Teste',
      email: 'teste@example.com',
      password: '1111111'
    })
    await request(api.server)
      .post('/user/login')
      .send({
        email: 'teste@example.com',
        password: '1111111'
      })
      .expect(200)
  })

  it('should not to be able to login if the user email does not exists in database', async () => {
    await request(api.server).post('/user/register').send({
      name: 'Usuário Teste',
      email: 'teste1@example.com',
      password: '1111111'
    })
    const { text } = await request(api.server)
      .post('/user/login')
      .send({
        email: 'teste2@example.com',
        password: '1111111'
      })
      .expect(404)
    expect(text).toEqual(
      'Usuário não encontrado. Verifique seus dados e tente novamente.'
    )
  })

  it('should not to be able to login if the password is incorrect', async () => {
    await request(api.server).post('/user/register').send({
      name: 'Usuário Teste',
      email: 'teste@example.com',
      password: '1111111'
    })
    const { text } = await request(api.server)
      .post('/user/login')
      .send({
        email: 'teste@example.com',
        password: '2222222'
      })
      .expect(401)
    expect(text).toEqual('Senha incorreta.')
  })
})
