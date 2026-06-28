import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { todoAdded, todoDeleted, todoToggled } from '@/entities/todo';
import { AddTodoForm } from '@/features/add-todo';
import { TodoFilter, type FilterStatus } from '@/features/filter-todos';
import { TodoList } from '@/widgets/todo-list';
import { useState } from 'react';

function HomePage() {
  const todos = useAppSelector((state) => state.todos.items);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<FilterStatus>('all');

  const addTodo = (text: string) => dispatch(todoAdded(text));
  const toggleTodo = (id: string) => dispatch(todoToggled(id));
  const deleteTodo = (id: string) => dispatch(todoDeleted(id));

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all' case
  });

  return (
    <div className='min-h-screen bg-gray-100'>
      <main className='mx-auto flex max-w-md flex-col gap-4 p-4'>
        <div className='flex flex-col gap-4 rounded-lg bg-white p-4 shadow'>
          <h1 className='text-3xl font-bold'>Todo list:</h1>
          <AddTodoForm onAdd={addTodo} />
          <TodoFilter value={filter} onChange={setFilter} />
          <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
      </main>
    </div>
  );
}

export { HomePage };
