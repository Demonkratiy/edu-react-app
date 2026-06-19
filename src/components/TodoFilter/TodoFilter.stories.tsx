import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';
import type { TodoFilterProps } from './TodoFilter';
import { TodoFilter } from './TodoFilter';

const meta = {
  title: 'Todos/TodoFilter',
  component: TodoFilter,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
  argTypes: {
    value: {
      control: 'radio',
      options: ['all', 'active', 'completed'],
    },
  },
} satisfies Meta<typeof TodoFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'all',
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<TodoFilterProps>();
    return (
      <TodoFilter
        {...args}
        value={value}
        onChange={(next) => {
          updateArgs({ value: next });
          args.onChange?.(next); // чтобы Actions panel тоже видел вызов
        }}
      />
    );
  },
};

export const ActiveSelected: Story = {
  args: {
    value: 'active',
  },
};

export const CompletedSelected: Story = {
  args: {
    value: 'completed',
  },
};
