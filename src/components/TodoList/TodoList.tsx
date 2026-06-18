import { TodoItem } from '@/components/TodoItem';
import type { Todo } from '@/types/todo';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoList = ({ todos, onToggle, onDelete }: TodoListProps) => {
  if (todos.length === 0) {
    return <p>No tasks yet</p>;
  }
  return (
    <ul className='flex flex-col w-full divide-y divide-gray-200'>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}
