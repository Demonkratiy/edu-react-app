import type { Todo } from '@/entities/todo';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TodoList } from './TodoList';

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

const meta: Meta<typeof TodoList> = {
  title: 'Todos/TodoList',
  component: TodoList,
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

type Story = StoryObj<typeof TodoList>;

export const Default: Story = {
  parameters: { preloadedState: { todos: { items: buildTodos(3) } } },
};

export const Empty: Story = {};

export const Single: Story = {
  parameters: { preloadedState: { todos: { items: buildTodos(1) } } },
};

export const AllCompleted: Story = {
  parameters: { preloadedState: { todos: { items: buildTodos(3, { completed: true }) } } },
};

export const Random: Story = {
  parameters: { preloadedState: { todos: { items: buildTodos(3, { mixed: true }) } } },
};
