import type { Todo } from '@/entities/todo';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { TodoWidget } from './TodoWidget';

const buildTodos = (count: number, options: { mixed?: boolean; completed?: boolean } = {}) => {
  const { mixed = false, completed = false } = options;
  const todos: Todo[] = [];
  for (let i = 0; i < count; i++) {
    todos.push({
      id: (i + 1).toString(),
      text: `Sample Todo number - ${i + 1}`,
      completed: mixed ? i % 2 === 0 : completed, // Alternate completed status if mixed is true, otherwise use the provided completed value
    });
  }
  return todos;
};

const meta: Meta<typeof TodoWidget> = {
  title: 'Todos/TodoWidget',
  component: TodoWidget,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className='max-w-md'>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TodoWidget>;

export const Default: Story = {
  parameters: { preloadedState: { todos: { items: buildTodos(3) } } },
};

export const Empty: Story = {};

export const FilteredActive: Story = {
  parameters: {
    preloadedState: {
      todos: { items: buildTodos(3, { mixed: true }) },
      filter: { status: 'active' },
    },
  },
};

// End-to-end: form, filter and list all wired to the same store through the facade hook.
export const AddsAndTogglesTodo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Add a new todo task');
    await userEvent.type(input, 'Buy milk');
    await userEvent.click(canvas.getByRole('button', { name: 'Add' }));
    await expect(canvas.getByText('Buy milk')).toBeInTheDocument();

    const checkbox = canvas.getByRole('checkbox');
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};
