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

A story file has two kinds of exports:

- **Default export** — `meta`, the configuration shared by all stories in the file.
- **Named exports** — individual stories, each rendering the component in a specific state.

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    onClick: fn(),
    children: 'Click me',
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: 'primary' },
}
```

## The `meta` object — full reference

The `meta` object answers the question: "What is true about this component for **every** story?"

```tsx
const meta: Meta<typeof MyComponent> = {
  // 1. Identification
  title: 'Group/Subgroup/Component',
  component: MyComponent,

  // 2. Tags (behavior flags)
  tags: ['autodocs'],

  // 3. Render environment
  parameters: { ... },

  // 4. Wrappers around every story
  decorators: [...],

  // 5. Default props for every story
  args: { ... },

  // 6. Control configuration
  argTypes: { ... },
}
```

### 1. `title` — sidebar location

Slashes create folders.

```tsx
title: 'UI/Button'           // UI > Button
title: 'Todos/TodoItem'      // Todos > TodoItem
title: 'UI/Forms/Input'      // UI > Forms > Input
```

**Rule of thumb:**
- `UI/*` for domain-agnostic UI kit.
- `<Feature>/*` for domain-specific business components.

### 2. `component` — the component itself

Used by Storybook for:
- Auto-generating controls from prop types.
- Generating the Docs page.
- Type inference for `args` and `StoryObj<typeof Component>`.

### 3. `tags` — behavior flags

| Tag | Effect |
|-----|--------|
| `'autodocs'` | Generate a Docs page with prop tables and all stories. |
| `'!autodocs'` | Disable autodocs (when enabled globally). |
| `'!dev'` | Hide from the Storybook UI in dev mode. |
| `'!test'` | Skip when running stories as tests. |

Most components: `tags: ['autodocs']`.

### 4. `parameters` — render environment

Parameters control **how Storybook renders the canvas**, not the component itself.

```tsx
parameters: {
  layout: 'centered',
  backgrounds: { default: 'dark' },
  viewport: { defaultViewport: 'mobile' },
}
```

| Parameter | Purpose |
|-----------|---------|
| `layout` | `'centered'` (center the component), `'fullscreen'` (no padding), `'padded'` (default with padding). |
| `backgrounds` | Switch canvas background colors (light/dark/custom). |
| `viewport` | Simulate device sizes (mobile, tablet, desktop). |
| `docs` | Customize the auto-generated docs page. |
| `a11y` | Configure the accessibility addon. |

**Heuristic:**
- Narrow components (Button, Input, TodoItem) → `layout: 'centered'`.
- Page-level components → `layout: 'fullscreen'`.

### 5. `decorators` — wrappers around each story

Used when a component **needs context** to render properly:
- Theme/i18n providers.
- Router context.
- A wrapper for layout/styling tests.

```tsx
decorators: [
  (Story) => (
    <div className="p-4 bg-gray-100">
      <Story />
    </div>
  ),
]
```

A decorator receives the story as a function and must render it. Multiple decorators wrap each other.

### 6. `args` — shared default props

```tsx
args: {
  onClick: fn(),
  children: 'Click me',
}
```

- Merged with each story's `args` — story-level overrides meta-level.
- Common pattern: put **callbacks** (`onClick`, `onChange`) here via `fn()` so all stories log to the Actions panel.

### 7. `argTypes` — control configuration

Use when Storybook can't guess the right control from the type.

```tsx
argTypes: {
  variant: { control: 'select', options: ['primary', 'danger'] },
  disabled: { control: 'boolean' },
  todo: { control: 'object' },          // JSON editor
  onClick: { table: { disable: true } } // hide from controls panel
}
```

| Control type | When |
|--------------|------|
| `'select'` / `'radio'` | A string prop with a fixed set of values. |
| `'boolean'` | Boolean props. |
| `'text'` | Free-form string. |
| `'object'` | Complex object props (rendered as JSON editor). |
| `'color'`, `'date'`, `'number'`, `'range'` | Specialized inputs. |

## Checklist when writing a new story file

When you start a new story file, walk through these questions:

1. **Where does this component belong in the sidebar?** → `title`
2. **Should it have a Docs page?** → `tags: ['autodocs']` (almost always)
3. **How should the canvas look?** → `parameters.layout`
4. **Does it need providers/context?** → `decorators`
5. **What's true about every story?** → `args` (typically callbacks via `fn()`)
6. **Can Storybook infer all controls correctly?** → if not, add `argTypes`
7. **What are the meaningful states?** → individual stories

For most components, only #1, #2, #3, #5, and #7 are needed.

## Story merging

When Storybook renders a story, it computes the final args by merging:

```
meta.args  →  story.args  →  controls panel overrides
   (left to right; later wins)
```

This is why you can put `onClick: fn()` once in `meta.args` and it applies to every story automatically.

## Mocks via `fn()` and the Actions panel

`fn()` from `storybook/test` creates a **mock function** — it does nothing on its own, but records every call (arguments, return value, call count). Storybook auto-detects mocks declared in `args` and logs each invocation in the **Actions** panel at the bottom of the canvas.

```tsx
const meta: Meta<typeof Form> = {
  args: {
    onSubmit: fn(),   // every call to props.onSubmit shows up in Actions
  },
}
```

### How to keep the Actions panel working

The connection between a mock and the Actions panel is via the specific `fn()` instance stored in `args`. Two common ways to break it:

```tsx
// ❌ Creating a new mock inline — disconnects from args
<Form onSubmit={fn()} />

// ❌ Replacing with a non-mock — disconnects from args
<Form onSubmit={() => doStuff()} />
```

In a `render` function, always invoke the mock from `args`:

```tsx
export const Interactive: Story = {
  render: (args) => {
    const handleSubmit = (data) => {
      args.onSubmit(data)   // ✅ mock from args — logs in Actions panel
      // ...local state updates...
    }
    return <Form onSubmit={handleSubmit} />
  },
}
```

### Where to see calls

- **Single story view** (sidebar entry like `Interactive`): bottom panel → `Actions` tab.
- **Docs view** does not show Actions — that page is a static catalog.
- The bottom panel may be hidden — toggle with the `D` shortcut or the panel button in the toolbar.

### Storybook 10 note

Older versions required `@storybook/addon-actions`. In Storybook 10 the Actions panel is **built into core** when using `fn()`. The separate addon is no longer needed.

## `play` functions — programmatic interactions

A `play` function runs **after** the story renders and uses Testing Library APIs to drive the component as a user would: type into inputs, click buttons, navigate. This is the canonical way to demonstrate states that depend on user interaction (e.g. a form that has no `initialValue` prop but should be shown filled).

```tsx
import { userEvent, within } from 'storybook/test'

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Add a new todo')
    await userEvent.type(input, 'Buy milk')
  },
}
```

- `canvasElement` is the DOM root of the rendered story.
- `within(canvasElement)` scopes Testing Library queries to this story only.
- `userEvent.*` simulates real user actions and triggers the same handlers as a real interaction (so internal `useState` updates).

### `play` does not run in Docs by default

The Docs page renders many stories simultaneously; running `play` for all of them would be slow and visually chaotic. Storybook intentionally skips `play` on the Docs page — you'll see the **default state** of each story there, and the **played state** only when you open the story individually.

To opt in for a specific story (rare, but possible):

```tsx
export const Filled: Story = {
  parameters: {
    docs: { story: { autoplay: true } },
  },
  play: async (/* ... */) => { /* ... */ },
}
```

Or for the whole module — set the same parameter in `meta.parameters`. Default off is the right behavior; only flip it when a story really needs to demonstrate the interactive state in the catalog.

### When to use `play` vs `args`

| Need | Tool |
|------|------|
| Show a state that's reachable via props | `args` |
| Show a state that requires typing/clicking | `play` |
| Compose multiple interactions for a regression scenario | `play` |
| Verify behavior in tests | `play` + assertions (read more in [Storybook tests](https://storybook.js.org/docs/writing-tests/component-testing)) |

## Layout choice — match the real-world context

The `parameters.layout` value tells Storybook **what kind of context to render the story in**. There is no "no layout" — even the absence of a value uses the default `padded`. Pick the value that matches how the component will be used in the real app.

| Layout | When |
|--------|------|
| `centered` | Tiny, self-contained UI: `Button`, `Checkbox`, `Badge`. Easy to inspect details. |
| `padded` (default) | Components that depend on container width: forms, lists, cards. |
| `fullscreen` | Full pages and layout components that manage their own size. |

**Pitfall:** in `centered` layout, Storybook centers the story and gives it content-width — `w-full` and `max-w-*` on the component will look like they did nothing. That's a Storybook artifact, not a bug in the component. Switch to `padded` (or add a `decorators` wrapper with explicit width) and the classes will work as expected in the real app.

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
