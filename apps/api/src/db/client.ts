import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import * as schema from './schema'

export async function connectDb(url: string) {
  const db = drizzle(url, { schema })
  await migrate(db, { migrationsFolder: 'migrations' })
  return db
}

export type Database = LibSQLDatabase<typeof schema>
