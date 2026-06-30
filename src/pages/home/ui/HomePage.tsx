import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { todoAdded, todoDeleted, todoToggled } from '@/entities/todo';
import { AddTodoForm } from '@/features/add-todo';
import {
  filterChanged,
  selectFilteredTodos,
  selectFilterStatus,
  TodoFilter,
  type FilterStatus,
} from '@/features/filter-todos';
import { TodoList } from '@/widgets/todo-list';

function HomePage() {
  const filterStatus = useAppSelector(selectFilterStatus);
  const filteredTodos = useAppSelector(selectFilteredTodos);

  const dispatch = useAppDispatch();

  // todo slice actions
  const addTodo = (text: string) => dispatch(todoAdded(text));
  const toggleTodo = (id: string) => dispatch(todoToggled(id));
  const deleteTodo = (id: string) => dispatch(todoDeleted(id));
  // filter slice actions
  const setFilter = (status: FilterStatus) => dispatch(filterChanged(status));

  return (
    <div className='min-h-screen bg-gray-100'>
      <main className='mx-auto flex max-w-md flex-col gap-4 p-4'>
        <div className='flex flex-col gap-4 rounded-lg bg-white p-4 shadow'>
          <h1 className='text-3xl font-bold'>Todo list:</h1>
          <AddTodoForm onAdd={addTodo} />
          <TodoFilter value={filterStatus} onChange={setFilter} />
          <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
      </main>
    </div>
  );
}

export { HomePage };
