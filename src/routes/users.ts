import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import knex from '../database'

export async function usersRoutes(api: FastifyInstance) {
  api.post('/login', async (request, reply) => {
    const getUserParamsSchema = z.object({
      email: z.string(),
      password: z.coerce.string()
    })

    const { email, password } = getUserParamsSchema.parse(request.body)

    const user = await knex('users').where('email', email).first()

    if (!user) {
      return reply
        .status(404)
        .send('Usuário não encontrado. Verifique seus dados e tente novamente.')
    }

    if (user.password !== password) {
      return reply.status(401).send('Senha incorreta.')
    }

    const { id, name } = user

    return reply.status(200).send({ id, name, email })
  })

  api.post('/register', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.any().transform((value) => {
        return value === undefined ? null : String(value)
      })
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const findUser = await knex('users').where('email', email).first()

    if (findUser) {
      return reply.status(409).send('Usuário já existe.')
    }

    const userId = crypto.randomUUID()

    await knex('users').insert({
      id: userId,
      name,
      email,
      password: password as string
    })

    return reply.status(200).send({ id: userId, name, email })
  })
}
