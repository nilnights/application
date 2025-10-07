import { defineRouter } from '../factory'
import { todoRouter } from './todos'

export const router = defineRouter({
  todos: todoRouter,
})
