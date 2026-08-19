import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AddTodoForm } from './AddTodoForm';

const meta: Meta<typeof AddTodoForm> = {
  title: 'Todos/AddTodoForm',
  component: AddTodoForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: { onAdd: fn() },
};
export default meta;

type Story = StoryObj<typeof AddTodoForm>;

// Presentational again — onAdd is a prop, the widget owns the dispatch.
export const Default: Story = {};

export const AddsTodo: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Add a new todo task');
    await userEvent.type(input, 'Buy milk');
    await userEvent.click(canvas.getByRole('button', { name: 'Add' }));
    await expect(input).toHaveValue(''); // input cleared after submit
    await expect(args.onAdd).toHaveBeenCalledWith('Buy milk');
  },
};
