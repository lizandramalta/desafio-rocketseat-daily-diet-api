// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
      createdAt: string
    }
    meals: {
      id: string
      user: string
      name: string
      description: string
      onDiet: boolean
      timestamp: string
      createdAt: string
      updatedAt: string
    }
  }
}
