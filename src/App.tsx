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
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <main className='max-w-md mx-auto p-4 flex flex-col gap-4'>
        <div className='bg-white rounded-lg shadow p-4 flex flex-col gap-4'>
          <h1 className='text-3xl font-bold'>Todo list:</h1>
          <AddTodoForm onAdd={addTodo} />
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>
      </main>
    </div>
  );
}

export default App;
