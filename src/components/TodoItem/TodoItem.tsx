import type { Todo } from '@/types/todo'
import { Button, Checkbox } from '@/components/ui'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <li className="flex items-center justify-between py-2 gap-3 w-full">
        <label className="flex items-center gap-2 cursor-pointer min-w-0">
            <Checkbox checked={todo.completed} onChange={() => onToggle(todo.id)} />
            <span className={`${todo.completed ? 'line-through text-gray-500' : ''} wrap-anywhere`}>
                {todo.text}
            </span>
        </label>
        <Button variant="danger" size="sm" onClick={() => onDelete(todo.id)}>Delete</Button>
    </li>
  )
}