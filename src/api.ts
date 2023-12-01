import fastify from 'fastify'
import { usersRoutes } from './routes/users'

const api = fastify()

api.register(usersRoutes, {
  prefix: 'user'
})

export default api
