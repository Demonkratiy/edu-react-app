# Rendering patterns in React

How a component decides **what** to return based on its props and state. Two themes:

1. **Conditional rendering** — picking between alternatives.
2. **Lists** — rendering one element per item in a collection.

Both look trivial but have non-obvious traps. This page is the single reference.

## Conditional rendering — five patterns

### 1. Early return (guard clause)

```tsx
export const Component = ({ loading, error, items }) => {
  if (loading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  if (items.length === 0) return <EmptyState />

  return <List items={items} />
}
```

**Use when:** the component has several "totally different" states. Each branch is at the top level, easy to read.

**Default choice** for two-or-more-branch logic with no shared wrapper.

### 2. Ternary in JSX

```tsx
return (
  <button>
    {isLoading ? 'Saving...' : 'Save'}
  </button>
)
```

**Use when:** small switch inside an existing JSX block. Both branches must produce something.

Don't nest ternaries — `a ? b : c ? d : e` is unreadable. Switch to early return or a variable.

### 3. Logical `&&` — show or hide

```tsx
return (
  <div>
    <h1>Profile</h1>
    {user.isAdmin && <AdminPanel />}
  </div>
)
```

**Use when:** something is rendered or completely absent. No alternative branch.

#### Pitfall: numbers and empty strings

```tsx
{count && <p>Total: {count}</p>}
// If count === 0, this renders the literal "0" in the DOM!
```

React renders these values:

| Value | Rendered? |
|-------|-----------|
| `false`, `null`, `undefined` | ❌ ignored |
| `0`, `'0'`, `''`, `NaN` | ✅ rendered as text |

The `&&` short-circuits and returns the falsy *left* operand. If that operand is `0`, React prints `0`.

Fix:

```tsx
{count > 0 && <p>Total: {count}</p>}
{Boolean(count) && <p>Total: {count}</p>}
{!!count && <p>Total: {count}</p>}
```

### 4. Variable as accumulator

```tsx
let content
if (loading) {
  content = <Spinner />
} else if (error) {
  content = <ErrorMessage />
} else {
  content = <List items={items} />
}

return (
  <Layout title="Tasks">
    {content}
  </Layout>
)
```

**Use when:** several branches share a common wrapper. Early return doesn't fit (each branch would have to repeat the wrapper); a ternary tree is unreadable.

### 5. Extract sub-components

When a branch has substantial JSX, lift it out:

```tsx
export const TodoList = ({ todos, onToggle, onDelete }: Props) => {
  if (todos.length === 0) return <EmptyState />
  return <PopulatedList todos={todos} onToggle={onToggle} onDelete={onDelete} />
}
```

**Use when:** branches grow large, repeat across components, or are unit-tested in isolation.

## Choosing the right pattern

| Scenario | Pattern |
|----------|---------|
| Loading / error / empty / populated in one component | Early return |
| Toggle a piece of text or label inside JSX | Ternary |
| Optionally show a section | `&&` |
| Multiple branches with a common wrapper | Variable |
| Branches are large or reused | Sub-components |

## The `else` after `return` rule

```tsx
// ❌ Redundant — `else` after `return` is dead syntax
if (cond) {
  return foo
} else {
  return bar
}

// ✅ Early return
if (cond) {
  return foo
}
return bar
```

After `return`, control flow leaves the function. The "else" branch is implicitly everything below. ESLint's `no-else-return` enforces this.

## Lists — `.map` and `key`

Render one element per array item:

```tsx
<ul>
  {todos.map((todo) => (
    <TodoItem
      key={todo.id}
      todo={todo}
      onToggle={onToggle}
      onDelete={onDelete}
    />
  ))}
</ul>
```

### `key` is mandatory and must be stable + unique

React uses `key` to match elements between renders so that:

- Component state is preserved when items reorder.
- Inserts/deletes don't accidentally remount the wrong items.
- DOM updates are minimal.

#### Don't use `index` as key when the list mutates

```tsx
{todos.map((todo, i) => <TodoItem key={i} ... />)}  // ❌
```

If you remove the first item, every remaining item shifts to a new index. React thinks "the item at key=0 changed its props" and reuses the wrong DOM node. Local state inside list items (open/closed, edit-mode flags, focus) leaks to the wrong row.

#### When `index` is fine

The list is **static** — never reordered, never inserted into the middle, never deleted. Truly read-only. Examples: a hard-coded set of menu items, a constant list of months.

Even then, prefer a stable string when one exists.

#### Don't use `Math.random()`, generated UUIDs at render, or stringified objects

A new key every render = full remount = broken state, broken animations, broken focus. Generate IDs **once** when the data is created, not when it's rendered.

### Where to render `<li>`

If a child component renders `<li>`, the parent **must** render `<ul>` or `<ol>`. The HTML spec requires `<li>` to be a direct child of a list element. Browsers silently restructure invalid markup, screen readers get confused.

| Tag | Meaning |
|-----|---------|
| `<ul>` | Unordered list. Order doesn't change meaning. |
| `<ol>` | Ordered list. Reordering changes meaning (steps, ranking). |

Numbering in the UI (1, 2, 3...) is a *visual* concern — solved with CSS counters on a `<ul>`, not a reason to switch to `<ol>`.

## Empty state is part of the design

Any component that renders a list **must** decide what to show when the array is empty. Skipping this turns into ghosts of UI: a header with no content, a frame around nothing.

Common options:

- A short message: "No tasks yet."
- A call-to-action: "No tasks yet — add one above."
- An illustration + message for richer UIs.

In code, empty state usually goes through early return:

```tsx
if (items.length === 0) return <EmptyState />
return <ItemList items={items} />
```

## Four states of async data

When a list comes from an API instead of local state, the component has **four** states, not two. Forgetting any of them creates real UX bugs.

| State | Condition | What to render |
|-------|-----------|----------------|
| Loading | Request in flight | Spinner / skeleton |
| Error | Request failed | Error message + retry |
| Empty | Request succeeded, zero items | Empty-state UI |
| Populated | Request succeeded, items present | The list |

Sketch:

```tsx
if (isLoading) return <Spinner />
if (error) return <ErrorMessage error={error} />
if (items.length === 0) return <EmptyState />
return <List items={items} />
```

The order of these guards matters — a successful response with zero items is *not* an error, and a still-loading response is not "empty". Get the conditions right or these states leak into each other.

For the current TODO project, data is synchronous (in-memory state) — only `empty` and `populated` apply. Keep the four-state pattern in mind for the next project that talks to a real API.
