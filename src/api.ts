import fastify from 'fastify'
import cors from '@fastify/cors'
import { usersRoutes } from './routes/users'

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

export default api
