import type { TRPCService } from '@apps/api/trpc/types'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

export type { InferTRPCInput, InferTRPCOutput } from '@apps/api/trpc/types'

export const trpc = createTRPCClient<TRPCService>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL,
      transformer: superjson,
    }),
  ],
})
