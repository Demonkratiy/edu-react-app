# Lifting State Up

A core React pattern for sharing state between sibling components.

## The problem

A child component knows **what the user did** (clicked, typed, toggled) but doesn't own the data — the data lives in a list, store, or parent state.

For example, `TodoItem` knows the user clicked the checkbox, but the array of todos lives in the parent. The child can't mutate it directly.

## The pattern

1. **Lift state** to the closest common parent.
2. The parent passes:
   - the **data** down (as props)
   - the **callbacks** down (as props starting with `on*`)
3. The child calls the callback when something happens.
4. The parent updates the state.

```
        ┌──── App / TodoList ────┐
        │  state: todos[]        │
        │  setTodos(...)         │
        └────┬──────────────┬────┘
             │ todo, onX    │ todo, onX
             ▼              ▼
        TodoItem        TodoItem
        (calls onX)     (calls onX)
```

## Example

```tsx
// Parent owns the state
function App() {
  const [todos, setTodos] = useState<Todo[]>(...)

  const toggle = (id: string) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }

  const remove = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  return todos.map(todo => (
    <TodoItem
      key={todo.id}
      todo={todo}
      onToggle={toggle}
      onDelete={remove}
    />
  ))
}

// Child only reports user intent
function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li>
      <Checkbox
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <Button onClick={() => onDelete(todo.id)}>Delete</Button>
    </li>
  )
}
```

## Naming convention

Callback props start with `on*`, mirroring native DOM events:

| Prop       | When called            |
| ---------- | ---------------------- |
| `onToggle` | User toggled something |
| `onDelete` | User deleted something |
| `onSubmit` | User submitted a form  |
| `onChange` | A value changed        |
| `onClick`  | Something was clicked  |

## Benefits

- **Single source of truth** — data lives in one place.
- **Predictable updates** — only the parent mutates the state.
- **Testable** — children are pure functions of props.
- **Reusable** — a child knows nothing about how the parent stores data.

## When to lift higher

If two siblings need the same state, lift it to their common parent. If many distant components need it — consider a global store (Context, Zustand, Redux). But default to lifting until it actually hurts.
