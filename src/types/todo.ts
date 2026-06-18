interface Todo {
  id: string
  text: string
  completed: boolean
}

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export type { Todo, TodoItemProps }