import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';
import { AddTodoForm } from './AddTodoForm';

const meta: Meta<typeof AddTodoForm> = {
  title: 'Todos/AddTodoForm',
  component: AddTodoForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onAdd: fn(),
  },
};
export default meta;

type Story = StoryObj<typeof AddTodoForm>;

export const Interactive: Story = {
  render: (args) => {
    const [todos, setTodos] = useState<string[]>([]);

    const handleAdd = (text: string) => {
      args.onAdd(text); // вызовем из args — попадёт в Actions panel
      setTodos((prev) => [...prev, text]);
    };

    return (
      <div className='flex flex-col gap-3'>
        <AddTodoForm onAdd={handleAdd} />
        <ul>
          {todos.map((t, i) => (
            <li key={i}>• {t}</li>
          ))}
        </ul>
      </div>
    );
  },
};

export const Empty: Story = {};

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Add a new todo');
    await userEvent.type(input, 'Buy milk');
  },
};
