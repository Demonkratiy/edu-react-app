import { AddTodoForm } from '@/features/add-todo';
import { TodoFilter } from '@/features/filter-todos';
import { TodoList } from '@/widgets/todo-list';

function HomePage() {
  return (
    <div className='min-h-screen bg-gray-100'>
      <main className='mx-auto flex max-w-md flex-col gap-4 p-4'>
        <div className='flex flex-col gap-4 rounded-lg bg-white p-4 shadow'>
          <h1 className='text-3xl font-bold'>Todo list:</h1>
          <AddTodoForm />
          <TodoFilter />
          <TodoList />
        </div>
      </main>
    </div>
  );
}

export { HomePage };
