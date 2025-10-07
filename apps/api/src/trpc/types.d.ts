import type { router } from './routers/_app'
import type { AnyProcedure, inferProcedureInput, inferProcedureOutput } from '@trpc/server'

export type TRPCService = typeof router

type RouterRecord = TRPCService['_def']['record']

type ExtractPaths<T, Prefix extends string = ''> = T extends Record<string, any>
  ? {
      [K in keyof T]: T[K] extends AnyProcedure
        ? Prefix extends ''
          ? K & string
          : `${Prefix}.${K & string}`
        : T[K] extends Record<string, any>
          ? ExtractPaths<
            T[K],
            Prefix extends '' ? (K & string) : `${Prefix}.${K & string}`
          >
          : never
    }[keyof T]
  : never

type GetProcedureByPath<T, Path extends string> = Path extends `${infer First}.${infer Rest}`
  ? First extends keyof T
    ? GetProcedureByPath<T[First], Rest>
    : never
  : Path extends keyof T
    ? T[Path] extends AnyProcedure
      ? T[Path]
      : never
    : never

export type InferTRPCInput<
  Path extends ExtractPaths<RouterRecord>,
> = inferProcedureInput<GetProcedureByPath<RouterRecord, Path>>

export type InferTRPCOutput<
  Path extends ExtractPaths<RouterRecord>,
> = inferProcedureOutput<GetProcedureByPath<RouterRecord, Path>>
