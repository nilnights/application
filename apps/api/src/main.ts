import { serve } from '@hono/node-server'
import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { createContext } from './trpc/context'
import { router } from './trpc/routers/_app'

const app = new Hono()

app.use('*', cors())
app.use('*', secureHeaders())
app.use('/trpc/*', trpcServer({
  router,
  createContext,
}))

serve({
  fetch: app.fetch,
  port: 3030,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
