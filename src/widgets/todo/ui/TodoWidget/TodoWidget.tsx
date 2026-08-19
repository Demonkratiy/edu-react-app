import { TodoItem } from '@/entities/todo';
import { AddTodoForm } from '@/features/add-todo';
import { TodoFilter } from '@/features/filter-todos';
import { useTodoWidget } from '@/widgets/todo/model/useTodoWidget';

// Container: owns the store connection, renders presentational children.
export const TodoWidget = () => {
  const { visibleTodos, filterStatus, addTodo, toggleTodo, deleteTodo, setFilter } =
    useTodoWidget();

  return (
    <div className='flex flex-col gap-4 rounded-lg bg-white p-4 shadow'>
      <h1 className='text-3xl font-bold'>Todo list:</h1>
      <AddTodoForm onAdd={addTodo} />
      <TodoFilter status={filterStatus} onChange={setFilter} />
      {visibleTodos.length === 0 ? (
        <p>No tasks yet, time to relax 😉</p>
      ) : (
        <ul className='flex w-full flex-col divide-y divide-gray-200'>
          {visibleTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
          ))}
        </ul>
      )}
    </div>
  );
};
