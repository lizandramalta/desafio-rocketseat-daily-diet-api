import { FastifyInstance } from 'fastify'
import knex from '../database'
import { z } from 'zod'

export async function mealsRoutes(api: FastifyInstance) {
  api.get('/:user', async (request, reply) => {
    const getMealParamsSchema = z.object({
      user: z.string().uuid()
    })

    const { user } = getMealParamsSchema.parse(request.params)

    const meals = await knex('meals')
      .where('user', user)
      .select('id', 'name', 'description', 'onDiet', 'timestamp')
      .orderBy('timestamp', 'desc')

    return reply.status(200).send(meals)
  })

  api.post('/', async (request, reply) => {
    const getMealParamsSchema = z.object({
      user: z.string().uuid(),
      name: z.string(),
      description: z.string().default(''),
      timestamp: z.string(),
      onDiet: z.boolean()
    })

    const { timestamp, description, name, onDiet, user } =
      getMealParamsSchema.parse(request.body)

    await knex('meals').insert({
      id: crypto.randomUUID(),
      user,
      name,
      description,
      timestamp,
      onDiet
    })

    return reply.status(201).send()
  })

  api.delete('/', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
      user: z.string().uuid()
    })

    const { id, user } = getMealParamsSchema.parse(request.body)
    const meal = await knex('meals').where({ id }).first()

    if (!meal) {
      return reply.status(404).send('Refeição não existe.')
    } else if (meal.user !== user) {
      return reply
        .status(403)
        .send(
          'Essa refeição não pertence a esse usuário. Não é possível excluí-la.'
        )
    }

    await knex('meals').where({ id, user }).del()
    return reply.status(201).send()
  })

  api.put('/', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
      user: z.string().uuid(),
      name: z.string(),
      description: z.string().default(''),
      timestamp: z.string(),
      onDiet: z.boolean()
    })

    const { description, id, name, onDiet, timestamp, user } =
      getMealParamsSchema.parse(request.body)

    const meal = await knex('meals').where({ id }).first()

    if (!meal) {
      return reply.status(404).send('Refeição não existe.')
    } else if (meal.user !== user) {
      return reply
        .status(403)
        .send(
          'Essa refeição não pertence a esse usuário. Não é possível editá-la.'
        )
    }

    await knex('meals').where({ id, user }).update({
      description,
      name,
      onDiet,
      timestamp
    })

    return reply.status(201).send()
  })
}
