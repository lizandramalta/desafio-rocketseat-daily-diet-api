import env from './src/env'
import api from './src/api'

api
  .listen({
    port: env.PORT
  })
  .then(() => console.log('HTTP Server Running'))
