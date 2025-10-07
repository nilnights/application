import type { TRPCContext } from './context'
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
})

export const defineRouter = t.router
export const defineMiddleware = t.middleware

export const defineProcedure = t.procedure
