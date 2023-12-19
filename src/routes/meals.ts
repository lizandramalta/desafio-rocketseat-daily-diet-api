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
      .select('id', 'name', 'description', 'onDiet', 'time', 'date')
      .orderBy('date', 'desc')
      .orderBy('time', 'desc')

    return reply.status(200).send(meals)
  })

  api.post('/', async (request, reply) => {
    const getMealParamsSchema = z.object({
      user: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      time: z.string(),
      date: z.string(),
      onDiet: z.boolean()
    })

    const { date, description, name, onDiet, time, user } =
      getMealParamsSchema.parse(request.body)

    await knex('meals').insert({
      id: crypto.randomUUID(),
      user,
      name,
      description,
      time,
      date,
      onDiet
    })

    return reply.status(201).send()
  })
}
