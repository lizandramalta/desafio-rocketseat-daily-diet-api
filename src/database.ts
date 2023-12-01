import setupKnex, { Knex } from 'knex'
import env from './env'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

const knex = setupKnex(config)

export default knex
