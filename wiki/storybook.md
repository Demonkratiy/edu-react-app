# Storybook

A tool for developing UI components in isolation. Each component renders independently in a separate dev server, with all its states described as **stories**.

## Why use it

- Build and test components without running the full app.
- See all states of a component at once (default, disabled, loading, error, etc.).
- Auto-generated documentation from props and stories.
- A living UI catalog for the team.

## Project structure convention

Each component lives in its own folder, co-located with its story:

```
src/components/
├── ui/                    # generic, reusable building blocks
│   └── Button/
│       ├── Button.tsx
│       ├── Button.stories.tsx
│       └── index.ts
└── TodoItem/              # business components (domain-specific)
    ├── TodoItem.tsx
    ├── TodoItem.stories.tsx
    └── index.ts
```

`index.ts` re-exports the component so imports stay clean:

```ts
import { Button } from '@/components/ui/Button'
```

## Configuration files

| File | Purpose |
|------|---------|
| `.storybook/main.ts` | Which files are stories, which addons are enabled, which framework. |
| `.storybook/preview.tsx` | Global setup: imports CSS (`index.css`), decorators, parameters. |
| `.storybook/tsconfig.json` | TS config for files inside `.storybook/` (extends `tsconfig.app.json`). |

### Tailwind in Storybook

Storybook renders components in a separate iframe and does not know about the app's CSS by default. To make Tailwind classes work, import the global stylesheet in `preview.tsx`:

```tsx
import '../src/index.css'
```

## Anatomy of a story file

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',          // path in sidebar
  component: Button,           // links props to controls
  tags: ['autodocs'],          // auto-generate Docs page
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
    disabled: { control: 'boolean' },
  },
  args: {                      // defaults shared by all stories
    onClick: fn(),
    children: 'Click me',
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: 'primary' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
```

### Key concepts

| Term | Meaning |
|------|---------|
| `Meta` | Default export config: title, component, default args. |
| `Story` (`StoryObj`) | Single named export = one story in the sidebar. |
| `args` | Props passed to the component. Story `args` merge with `meta.args`. |
| `argTypes` | Controls how Storybook renders the controls panel (`select`, `radio`, `boolean`, etc.). |
| `tags: ['autodocs']` | Generates a Docs page with prop tables and examples. |
| `fn()` from `storybook/test` | Mock function. Logs calls in the **Actions** panel — useful for `onClick`, `onChange`. |

## Commands

| Command | What it does |
|---------|--------------|
| `npm run storybook` | Start dev server (default port `6006`). |
| `npm run build-storybook` | Build a static version (for deploy / CI). |

## Useful tips

- **`title` with slashes** groups stories in the sidebar: `'UI/Button'` → folder `UI` → entry `Button`.
- **`autodocs`** generates a docs page automatically. Without it, only the Canvas view is available.
- **`args` are merged**: story-level args override meta-level args, controls override both.
- **Story files are excluded from production build** — they live with the components but are only read by Storybook.

## Links

- [Official docs](https://storybook.js.org/docs)
- [Writing stories](https://storybook.js.org/docs/writing-stories)
- [Args / argTypes](https://storybook.js.org/docs/writing-stories/args)
