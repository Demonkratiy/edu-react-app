import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    placeholder: 'Type something...',
    onChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: 'Hello world' },
}

export const Invalid: Story = {
  args: { invalid: true, defaultValue: 'Wrong value' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Cannot edit' },
}

export const Password: Story = {
  args: { type: 'password', defaultValue: 'secret' },
}
