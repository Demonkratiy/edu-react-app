import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { TodoList } from './TodoList'
import type { Todo } from '@/types/todo'

const buildTodos = (count: number, options: { mixed?: boolean, completed?: boolean } = {}) => {
    const { mixed = false, completed = false } = options
    const todos: Todo[] = []
    for (let i = 0; i < count; i++) {
        todos.push({
            id: (i + 1).toString(),
            text: `Sample Todo number - ${i + 1}`,
            completed: mixed ? i % 2 === 0 : completed, // Alternate completed status if mixed is true, otherwise use the provided completed value
        })
    }
    return todos
}

const meta: Meta<typeof TodoList> = {
  title: 'Todos/TodoList',
  component: TodoList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
  args: {
    onToggle: fn(),
    onDelete: fn(),
  },
}
export default meta

type Story = StoryObj<typeof TodoList>

export const Default: Story = {
    args: {
        todos: buildTodos(3),
    }
}

export const Empty: Story = {
    args: {
        todos: [],
    }
}

export const Single: Story = {
    args: {
        todos: buildTodos(1),
    }
}

export const AllCompleted: Story = {
    args: {
        todos: buildTodos(3, { completed: true }),
    }
}

export const Random: Story = {
    args: {
        todos: buildTodos(3, { mixed: true }),
    }
}
