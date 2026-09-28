import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

let db: ReturnType<typeof drizzle<typeof schema>> | undefined

export function useDb() {
  if (!db) {
    const url = useRuntimeConfig().databaseUrl
    if (!url) throw new Error('DATABASE_URL is not configured')
    const pool = new Pool({ connectionString: url })
    db = drizzle(pool, { schema })
  }
  return db
}
