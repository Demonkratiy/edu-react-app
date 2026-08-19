import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TodoFilter } from './TodoFilter';

const meta = {
  title: 'Todos/TodoFilter',
  component: TodoFilter,
  tags: ['autodocs'],
  args: { status: 'all', onChange: fn() },
} satisfies Meta<typeof TodoFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ActiveSelected: Story = {
  args: { status: 'active' },
};

export const CompletedSelected: Story = {
  args: { status: 'completed' },
};

// Controlled component: it reports the click, the widget decides the next status.
export const SelectsFilter: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const activeBtn = canvas.getByRole('button', { name: 'Active' });
    await userEvent.click(activeBtn);
    await expect(args.onChange).toHaveBeenCalledWith('active');
  },
};
