import { FastifyInstance } from 'fastify'
import knex from '../database'
import { z } from 'zod'
import moment from 'moment'
import 'moment/locale/pt-br'

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

    const mealsOnDiet = meals.reduce((count, meal) => {
      return count + (meal.onDiet ? 1 : 0)
    }, 0)

    const mealsOffDiet = meals.reduce((count, meal) => {
      return count + (meal.onDiet ? 0 : 1)
    }, 0)

    let bestSequence = 0
    let currentSequence = 0
    meals.forEach((meal) => {
      if (meal.onDiet) {
        currentSequence++
        if (currentSequence > bestSequence) bestSequence = currentSequence
      } else {
        currentSequence = 0
      }
    })

    const totalMeals = meals.length

    const percentageMealsOnDiet = ((mealsOnDiet / totalMeals) * 100).toFixed(2)

    return reply.status(200).send({
      meals,
      metrics: {
        bestSequence,
        mealsOffDiet,
        mealsOnDiet,
        percentageMealsOnDiet,
        totalMeals
      }
    })
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

    await knex('meals')
      .where({ id, user })
      .update({
        description,
        name,
        onDiet,
        timestamp,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      })

    return reply.status(201).send()
  })
}
