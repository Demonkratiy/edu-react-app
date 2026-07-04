import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { TodoFilter } from './TodoFilter';

const meta = {
  title: 'Todos/TodoFilter',
  component: TodoFilter,
  tags: ['autodocs'],
} satisfies Meta<typeof TodoFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Empty store → the filter defaults to 'all'.
export const Default: Story = {};

// Preload the filter slice to show a specific selected state (no props involved).
export const ActiveSelected: Story = {
  parameters: { preloadedState: { filter: { status: 'active' } } },
};

export const CompletedSelected: Story = {
  parameters: { preloadedState: { filter: { status: 'completed' } } },
};

// Clicking a button dispatches filterChanged; the component reflects it itself.
export const SelectsFilter: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const activeBtn = canvas.getByRole('button', { name: 'Active' });
    await userEvent.click(activeBtn);
    await expect(activeBtn).toHaveAttribute('aria-pressed', 'true'); // компонент сам отразил
  },
};
