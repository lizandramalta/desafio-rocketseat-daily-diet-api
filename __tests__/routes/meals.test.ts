import { it, beforeAll, afterAll, describe, beforeEach, expect } from 'vitest'
import api from '../../src/api'
import request from 'supertest'
import { execSync } from 'child_process'

describe('Meals routes', () => {
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

  it('should be able to create a new meal', async () => {
    await request(api.server).post('/user/register').send({
      name: 'Usuário Teste',
      email: 'teste@example.com',
      password: '1111111'
    })

    await request(api.server)
      .post('/meals')
      .send({
        user: '33fc4a26-afab-47a2-8e60-746329f4d298',
        name: 'First meal',
        description: 'Pasta',
        time: '20:30',
        date: '13/12/2023',
        onDiet: false
      })
      .expect(201)
  })

  it('should be able to list user meals', async () => {
    const { body } = await request(api.server).post('/user/register').send({
      name: 'Usuário Teste',
      email: 'teste@example.com',
      password: '1111111'
    })
    const { id } = body

    await request(api.server).post('/meals').send({
      user: id,
      name: 'First meal',
      description: 'Strogonoff',
      time: '20:30',
      date: '13/12/2023',
      onDiet: false
    })

    await request(api.server).post('/meals').send({
      user: id,
      name: 'Second meal',
      description: 'Pasta',
      time: '20:30',
      date: '13/12/2023',
      onDiet: false
    })

    const { body: meals } = await request(api.server).get(`/meals/${id}`).send()

    expect(meals.length).toEqual(2)
  })

  it('should not to be able to list other user meals', async () => {
    const { body: fistUserBody } = await request(api.server)
      .post('/user/register')
      .send({
        name: 'Usuário Teste',
        email: 'teste@example.com',
        password: '1111111'
      })
    const { id: firstUserId } = fistUserBody

    await request(api.server).post('/meals').send({
      user: firstUserId,
      name: 'First meal',
      description: 'Strogonoff',
      time: '20:30',
      date: '13/12/2023',
      onDiet: false
    })

    await request(api.server).post('/meals').send({
      user: firstUserId,
      name: 'Second meal',
      description: 'Pasta',
      time: '20:30',
      date: '13/12/2023',
      onDiet: false
    })

    const { body: secondUserBody } = await request(api.server)
      .post('/user/register')
      .send({
        name: 'Usuário Teste',
        email: 'teste2@example.com',
        password: '222222'
      })
    const { id: secondUserId } = secondUserBody

    const { body: firstUserMeals } = await request(api.server)
      .get(`/meals/${firstUserId}`)
      .send()

    expect(firstUserMeals.length).toEqual(2)

    const { body: secondUserMeals } = await request(api.server)
      .get(`/meals/${secondUserId}`)
      .send()

    expect(secondUserMeals.length).toEqual(0)
  })
})