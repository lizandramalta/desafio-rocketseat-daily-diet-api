import env from './src/env'
import app from './src/app'

app
  .listen({
    port: env.PORT
  })
  .then(() => console.log('HTTP Server Running'))
