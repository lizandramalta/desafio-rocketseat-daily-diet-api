import fastify from 'fastify'
import cors from '@fastify/cors'
import { mealsRoutes, usersRoutes } from './routes'

const api = fastify()

api.register(cors, {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
})

api.register(usersRoutes, {
  prefix: 'user'
})

api.register(mealsRoutes, {
  prefix: 'meals'
})

export default api
