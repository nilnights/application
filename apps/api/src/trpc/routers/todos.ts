import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { todos } from '../../db/schema'
import { defineProcedure, defineRouter } from '../factory'

export const todoRouter = defineRouter({
  list: defineProcedure
    .query(async ({ ctx: { db } }) => {
      const todos = await db.query.todos.findMany()
      return todos
    }),

  create: defineProcedure
    .input(z.object({
      name: z.string().min(2).max(100),
    }))
    .mutation(async ({ input: { name }, ctx: { db } }) => {
      const [todo] = await db.insert(todos).values({ name }).returning()
      return todo
    }),

  update: defineProcedure
    .input(z.object({
      id: z.number().min(1),
      name: z.string().optional(),
    }))
    .mutation(async ({ input: { id, name }, ctx: { db } }) => {
      const [todo] = await db.update(todos).set({ name }).where(eq(todos.id, id)).returning()
      return todo
    }),

  remove: defineProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx: { db } }) => {
      const [deleted] = await db.delete(todos).where(eq(todos.id, id)).returning()
      return deleted
    }),
})
