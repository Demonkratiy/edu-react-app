import { AddTodoForm } from '@/components/AddTodoForm';
import { TodoList } from '@/components/TodoList';
import type { Todo } from '@/types/todo';
import { useState } from 'react';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, completed: false }]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <main className='mx-auto flex max-w-md flex-col gap-4 p-4'>
        <div className='flex flex-col gap-4 rounded-lg bg-white p-4 shadow'>
          <h1 className='text-3xl font-bold'>Todo list:</h1>
          <AddTodoForm onAdd={addTodo} />
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
      </main>
    </div>
  );
}

export default App;
