import { useAppSelector } from '@/app/hooks';
import { selectTodos } from '@/entities/todo';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { AddTodoForm } from './AddTodoForm';

const meta: Meta<typeof AddTodoForm> = {
  title: 'Todos/AddTodoForm',
  component: AddTodoForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof AddTodoForm>;

// The form has no props anymore — it dispatches todoAdded to the store itself.
export const Default: Story = {};

// Small reader showing what the form dispatched into the (per-story) store.
const AddedTodoList = () => {
  const todos = useAppSelector(selectTodos);
  return (
    <ul className='text-sm text-gray-600'>
      {todos.map((todo) => (
        <li key={todo.id}>• {todo.text}</li>
      ))}
    </ul>
  );
};

export const WithList: Story = {
  render: () => (
    <div className='flex flex-col gap-3'>
      <AddTodoForm />
      <AddedTodoList />
    </div>
  ),
};

export const AddsTodo: Story = {
  ...WithList,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Add a new todo task');
    await userEvent.type(input, 'Buy milk');
    await userEvent.click(canvas.getByRole('button', { name: 'Add' }));
    await expect(input).toHaveValue(''); // input cleared after submit
    await expect(canvas.getByText('• Buy milk')).toBeInTheDocument(); // reached the store
  },
};
