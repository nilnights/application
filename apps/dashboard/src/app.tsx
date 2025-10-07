import { Route, Router } from '@solidjs/router'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { lazy } from 'solid-js'

export function App() {
  const client = new QueryClient()

  return (
    <QueryClientProvider client={client}>
      <Router>
        <Route path="/" component={lazy(() => import('./views/todos'))} />
        <Route path="**" component={lazy(() => import('./views/404'))} />
      </Router>
    </QueryClientProvider>
  )
}
