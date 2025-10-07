import type { Database } from '../db/client'
import type { Context } from 'hono'
import { connectDb } from '../db/client'

// eslint-disable-next-line ts/consistent-type-definitions
export type TRPCContext = {
  db: Database
}

export async function createContext(_: unknown, c: Context): Promise<TRPCContext> {
  const db = await connectDb(process.env.DATABASE_URL!)

  return {
    db,
  }
}
