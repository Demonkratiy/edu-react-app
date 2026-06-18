# Controlled vs Uncontrolled inputs

A core React concept for any form element (`input`, `textarea`, `select`, `checkbox`, `radio`).

## Two ways to manage form state

### Controlled

State lives in **React**. The input only displays it.

```tsx
const [text, setText] = useState('')
<input value={text} onChange={(e) => setText(e.target.value)} />
```

- `value` is the single source of truth.
- **`onChange` is required** — without it, React keeps overwriting the user's input back to `value`, freezing the field.
- Easy to validate, reset, or read the current value at any point.
- This is the default choice in real forms.

### Uncontrolled

State lives in the **DOM**. React only sets the initial value.

```tsx
<input defaultValue="hello" />
```

- `defaultValue` is just the starting value; the DOM takes it from there.
- To read the current value, use a `ref`:

  ```tsx
  const ref = useRef<HTMLInputElement>(null)
  ref.current?.value
  ```

- Simpler for trivial cases (demos, one-off forms).

## Cheat sheet

| Element | Controlled prop | Uncontrolled prop |
|---------|----------------|-------------------|
| `<input type="text">` | `value` | `defaultValue` |
| `<input type="checkbox">` | `checked` | `defaultChecked` |
| `<input type="radio">` | `checked` | `defaultChecked` |
| `<select>` | `value` | `defaultValue` |
| `<textarea>` | `value` | `defaultValue` |

## Why this matters in Storybook

Storybook stories have no logic, so passing `value: 'foo'` would create a controlled input **without** an `onChange` handler — the field would become read-only and React would log a warning.

Use `defaultValue` (or `defaultChecked`) in stories to keep the input editable while still demonstrating the visual state.

For interactive stories that need real state, use a `render` function:

```tsx
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return <Input value={value} onChange={(e) => setValue(e.target.value)} />
  },
}
```

## Component design takeaway

A reusable UI component (like our `Input`) should **not decide** whether it's controlled or uncontrolled. By spreading `...rest` onto the native element, both modes work — the parent decides which to use.
