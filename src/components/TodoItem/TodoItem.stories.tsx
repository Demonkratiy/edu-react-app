import {useState} from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Todo } from '@/types/todo';    
import { fn } from 'storybook/test'
import { TodoItem } from './TodoItem'

const longText = 'This is a very long todo item text to test how the component handles overflow and wrapping in the UI. ';
const longWordText = 'Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu';
const sampleTodo: Todo = {
  id: '1',
  text: 'Buy milk',
  completed: false,
}

const meta: Meta<typeof TodoItem> = {
  title: 'Todos/TodoItem',
  component: TodoItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onToggle: fn(),
    onDelete: fn(),
  },
}
export default meta

type Story = StoryObj<typeof TodoItem>

export const Interactive: Story = {
    args: {
        todo: sampleTodo,
    },
    render: (args) => {
        const [todo, setTodo] = useState(args.todo);
        const handleToggle = () => {
            setTodo((prev) => ({ ...prev, completed: !prev.completed }));
        }
        const noopDelete = fn();
        return (
            <TodoItem
                todo={todo}
                onToggle={handleToggle}
                onDelete={noopDelete} //dont need delete functionality in this single TodoItem story
            />
        )
    }    
}

export const Default: Story = {
  args: {
    todo: sampleTodo,
  },
}

export const Completed: Story = {
  args: {
    todo: {
      ...sampleTodo,
      completed: true,
    },
  },
}

export const LongText: Story = {
  args: {
    todo: {
      ...sampleTodo,
      text: longText + longWordText + longText + longWordText,
      completed: false,
    },
  },
}

export const LongString: Story = {
  args: {
    todo: {
      ...sampleTodo,
      text: longWordText + longWordText + longWordText + longWordText,
      completed: false,
    },
  },
}