import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { TodoItem, todoDeleted, todoToggled } from '@/entities/todo';
import { selectFilteredTodos } from '@/features/filter-todos';

export const TodoList = () => {
  const todos = useAppSelector(selectFilteredTodos);
  const dispatch = useAppDispatch();
  const toggleTodo = (id: string) => dispatch(todoToggled(id));
  const deleteTodo = (id: string) => dispatch(todoDeleted(id));

  if (todos.length === 0) {
    return <p>No tasks yet, time to relax 😉</p>;
  }
  return (
    <ul className='flex w-full flex-col divide-y divide-gray-200'>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
      ))}
    </ul>
  );
};
