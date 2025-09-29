import { useMutation, useQuery, useQueryClient } from '@tanstack/solid-query'
import { createEffect, createSignal, For, Match, Show, Switch } from 'solid-js'
import { trpc } from '@/libs/trpc'

export default function Home() {
  const queryClient = useQueryClient()
  const [newTodo, setNewTodo] = createSignal('')
  const [editingTodo, setEditingTodo] = createSignal<{ id: number, name: string } | null>(null)

  let editInputRef: HTMLInputElement | undefined

  createEffect(() => {
    if (editingTodo() && editInputRef) {
      editInputRef.focus()
    }
  })

  const todos = useQuery(() => ({
    queryKey: ['todos.list'],
    queryFn: () => trpc.todos.list.query(),
  }))

  const create = useMutation(() => ({
    mutationFn: (newName: string) => trpc.todos.create.mutate({ name: newName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos.list'] })
      setNewTodo('')
    },
  }))

  const update = useMutation(() => ({
    mutationFn: (variables: { id: number, name: string }) =>
      trpc.todos.update.mutate(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos.list'] })
      setEditingTodo(null)
    },
  }))

  const remove = useMutation(() => ({
    mutationFn: (id: number) => trpc.todos.remove.mutate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos.list'] })
    },
  }))

  const handleCreateTodo = (e: Event) => {
    e.preventDefault()
    if (newTodo().trim()) {
      create.mutate(newTodo().trim())
    }
  }

  const handleUpdateTodo = (id: number) => {
    // 检查 editingTodo 是否为 null，以及 name 是否为空
    const currentEditing = editingTodo()
    if (currentEditing && currentEditing.name.trim()) {
      update.mutate({ id, name: currentEditing.name.trim() })
    } else {
      // 如果名字为空，直接取消编辑状态，防止提交空内容
      setEditingTodo(null)
    }
  }

  return (
    <div class="flex flex-col h-full gap-4 p-4 pt-10 max-w-3xl mx-auto">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Todos</h1>
      </div>
      <form onSubmit={handleCreateTodo} class="flex gap-2">
        <input
          type="text"
          value={newTodo()}
          onInput={e => setNewTodo(e.currentTarget.value)}
          placeholder="Add a new todo"
          class="flex-grow p-2 border"
          disabled={create.isPending}
        />
        <button
          type="submit"
          class="border text-white p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={create.isPending || !newTodo().trim()}
        >
          <LucidePlus />
        </button>
      </form>

      <Switch>
        <Match when={todos.isLoading}>
          <p>Loading...</p>
        </Match>
        <Match when={todos.isError}>
          <p>
            An error occurred:
            {todos.error?.message}
          </p>
        </Match>
        <Match when={todos.isSuccess}>
          <Show
            when={todos.data && todos.data.length > 0}
            fallback={<p>No todos found. Click the button to create one!</p>}
          >
            <div class="flex flex-col gap-2">
              <For each={todos.data}>
                {todo => (
                  <div class="p-4 border flex justify-between items-center gap-4">
                    <Show
                      when={editingTodo()?.id === todo.id}
                      fallback={<h2 class="flex-grow">{todo.name}</h2>}
                    >
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingTodo()!.name}
                        onInput={e =>
                          setEditingTodo(p => (p ? { ...p, name: e.currentTarget.value } : null))}
                        onBlur={() => setEditingTodo(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateTodo(todo.id)
                          } else if (e.key === 'Escape') {
                            setEditingTodo(null)
                          }
                        }}
                        class="flex-grow"
                      />
                    </Show>

                    <div class="flex items-center gap-2">
                      <Show
                        when={editingTodo()?.id === todo.id}
                        fallback={(
                          <LucidePenSquare
                            class="cursor-pointer"
                            onClick={() => setEditingTodo({ id: todo.id, name: todo.name })}
                          />
                        )}
                      >
                        <LucideSave
                          class="cursor-pointer"
                          onClick={() => handleUpdateTodo(todo.id)}
                        />
                      </Show>
                      <LucideTrash2 class="text-red-400 cursor-pointer" onClick={() => remove.mutate(todo.id)} />
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </Match>
      </Switch>
    </div>
  )
}
