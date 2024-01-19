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
        timestamp: '2023-12-13-20-30',
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
      timestamp: '2023-12-13-20-30',
      onDiet: false
    })

    await request(api.server).post('/meals').send({
      user: id,
      name: 'Second meal',
      description: 'Pasta',
      timestamp: '2023-12-13-20-30',
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
      timestamp: '2023-12-13-20-30',
      onDiet: false
    })

    await request(api.server).post('/meals').send({
      user: firstUserId,
      name: 'Second meal',
      description: 'Pasta',
      timestamp: '2023-12-13-20-30',
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

  it('should be able to delete a meal', async () => {
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
      timestamp: '2023-12-13-20-30',
      onDiet: false
    })

    const { body: meals } = await request(api.server).get(`/meals/${id}`).send()

    await request(api.server)
      .delete('/meals')
      .send({
        id: meals[0].id,
        user: id
      })
      .expect(201)
  })

  it('should not to be able to delete a meal if user is not its owner', async () => {
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
      timestamp: '2023-12-13-20-30',
      onDiet: false
    })

    const { body: meals } = await request(api.server).get(`/meals/${id}`).send()

    await request(api.server)
      .delete('/meals')
      .send({
        id: meals[0].id,
        user: '3332446e-3614-46dd-8006-49eb4b8408e5'
      })
      .expect(403)
  })

  it('should not to be able to delete a meal if it does not exists', async () => {
    await request(api.server)
      .delete('/meals')
      .send({
        id: '3332446e-3614-46dd-8006-49eb4b8408e5',
        user: '3332446e-3614-46dd-8006-49eb4b8408e5'
      })
      .expect(404)
  })

  it('should be able to edit a meal', async () => {
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
      timestamp: '2023-12-13-20-30',
      onDiet: false
    })

    const { body: meals } = await request(api.server).get(`/meals/${id}`).send()

    await request(api.server)
      .put('/meals')
      .send({
        id: meals[0].id,
        user: id,
        name: 'Second meal',
        description: 'Strogonoff',
        timestamp: '2023-12-13-20-40',
        onDiet: true
      })
      .expect(201)
  })

  it('should not to be able to edit a meal if user is not its owner', async () => {
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
      timestamp: '2023-12-13-20-30',
      onDiet: false
    })

    const { body: meals } = await request(api.server).get(`/meals/${id}`).send()

    await request(api.server)
      .put('/meals')
      .send({
        id: meals[0].id,
        user: '3332446e-3614-46dd-8006-49eb4b8408e5',
        name: 'Second meal',
        description: 'Strogonoff',
        timestamp: '2023-12-13-20-40',
        onDiet: true
      })
      .expect(403)
  })

  it('should not to be able to edit a meal if it does not exists', async () => {
    await request(api.server)
      .put('/meals')
      .send({
        id: '3332446e-3614-46dd-8006-49eb4b8408e5',
        user: '3332446e-3614-46dd-8006-49eb4b8408e5',
        name: 'Second meal',
        description: 'Strogonoff',
        timestamp: '2023-12-13-20-40',
        onDiet: true
      })
      .expect(404)
  })
})
