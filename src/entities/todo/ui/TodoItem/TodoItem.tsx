import type { Todo } from '@/entities/todo/model/types';
import { Button, Checkbox } from '@/shared/ui';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <li className='flex w-full items-center justify-between gap-3 py-2'>
      <label className='flex min-w-0 cursor-pointer items-center gap-2'>
        <Checkbox checked={todo.completed} onChange={() => onToggle(todo.id)} />
        <span className={`${todo.completed ? 'text-gray-500 line-through' : ''} wrap-anywhere`}>
          {todo.text}
        </span>
      </label>
      <Button variant='danger' size='sm' onClick={() => onDelete(todo.id)}>
        Delete
      </Button>
    </li>
  );
};
