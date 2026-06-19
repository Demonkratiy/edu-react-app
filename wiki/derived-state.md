# Derived state in React

> If a value can be computed from existing state or props — don't store it. Compute it.

## What is derived state?

**Derived state** is any value that can be calculated from other state or props. It is not its own "source of truth" — it's a function of them.

Examples:

| Source state                             | Derived value                                 |
| ---------------------------------------- | --------------------------------------------- |
| `todos: Todo[]` + `filter: FilterStatus` | `visibleTodos` — filtered subset              |
| `items: CartItem[]`                      | `totalPrice` — sum of `item.price * item.qty` |
| `user: User \| null`                     | `isLoggedIn` — `user !== null`                |
| `text: string`                           | `wordCount` — `text.split(/\s+/).length`      |

In each row, the right-hand value is fully determined by the left-hand. There is no decision the user can make about it independently of the source.

## The rule

> **State holds only what cannot be derived. Everything else is computed inline.**

State exists in `useState` only when:

- It comes from outside (user input, network response, props), OR
- The value can change independently of any other state

If neither — it's derived. Don't put it in state.

## The anti-pattern

Tempting wrong approach: keep derived value in state, sync it with `useEffect`.

```tsx
const [todos, setTodos] = useState<Todo[]>([]);
const [filter, setFilter] = useState<FilterStatus>('all');

// ❌ ANTI-PATTERN
const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);

useEffect(() => {
  setVisibleTodos(
    todos.filter((t) => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    }),
  );
}, [todos, filter]);
```

### Why it's wrong

1. **Two sources of truth** — `todos` and `visibleTodos` claim to represent the same thing. If they drift, you have a bug. The compiler cannot catch this.
2. **Stale snapshots** — between a state update and the effect running, `visibleTodos` is one render behind `todos`. Components reading it see outdated data for one render.
3. **Double rendering** — every change to `todos` triggers a render, then the effect fires, then `setVisibleTodos` triggers a second render. Doubled work for no value.
4. **Easy to forget** — add a new derived state and forget to add it to the effect's deps array? Silent bug. ESLint helps, but it's still extra noise.

The React team named this category explicitly: see ["You Might Not Need an Effect"](https://react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state).

## The correct pattern

Just compute the value in the component body. It runs on every render — that's fine.

```tsx
const [todos, setTodos] = useState<Todo[]>([]);
const [filter, setFilter] = useState<FilterStatus>('all');

// ✅ Derived — recomputed every render
const visibleTodos = todos.filter((t) => {
  if (filter === 'active') return !t.completed;
  if (filter === 'completed') return t.completed;
  return true;
});
```

### Why this works

- **Single source of truth** — `todos` and `filter` are the only state. `visibleTodos` is always derived from current values, never stale.
- **Synchronous** — no effect to wait for. The render that sets new `todos` also produces correct `visibleTodos`.
- **One render** — change propagates in a single pass.
- **No deps to track** — JS closures handle it. If you read `todos` and `filter`, you get current values.

### Where to put it in the component

Convention:

```tsx
function Component() {
  // 1. State
  const [a, setA] = useState(...);
  const [b, setB] = useState(...);

  // 2. Handlers
  const handleX = () => { ... };

  // 3. Derived values
  const derived = a + b;

  // 4. Render
  return <div>{derived}</div>;
}
```

Derived sits between handlers and `return`. Reads naturally top-to-bottom.

## What about performance?

The classical objection: "but `todos.filter()` runs on every render — isn't that wasteful?"

For most apps — **no**. Modern JS engines run `.filter` on hundreds of items in microseconds. React's reconciliation cost dominates. The filter is noise.

It only matters when:

- The computation is **genuinely heavy** (parsing a large JSON, sorting thousands of items, complex math)
- The derived value is passed to a `React.memo` child that compares references

If either applies, reach for `useMemo`:

```tsx
const visibleTodos = useMemo(() => todos.filter(predicate), [todos, filter]);
```

### When NOT to `useMemo`

By default — don't.

- `useMemo` itself has overhead: storing the value, comparing deps every render
- For cheap computations and non-memoized children, the wrapper costs more than it saves
- It adds noise to read

Rule of thumb: **don't memoize speculatively**. Add `useMemo` only after a profiler shows the computation is a bottleneck, or after you wrap a child in `React.memo` and need stable references.

Kent C. Dodds wrote the canonical piece on this — ["When to useMemo and useCallback"](https://kentcdodds.com/blog/usememo-and-usecallback).

## Common derived values to watch for

These are almost always derived, not state:

- **Filtered / sorted lists** — derived from source list + filter/sort config
- **Counts / totals / aggregates** — derived from a collection
- **Boolean flags** like `isEmpty`, `hasErrors`, `canSubmit` — derived from data presence
- **Formatted strings** — `displayName`, `formattedDate`, `truncatedText`
- **Joined / split values** — `fullName = first + ' ' + last`

Whenever you reach for `useState` to hold one of these, pause and ask: _"Can I compute this from what I already have?"_

## Quick checklist before adding `useState`

1. Does this value come from outside the component (user input, API, prop)? → state, yes
2. Can this value change independently of all other state? → state, yes
3. Otherwise — it's derived. Compute it inline.

## See also

- [Lifting state up](./lifting-state-up.md) — where derived state forces you to lift inputs
- [Immutable state in React](./immutable-state.md) — keep state itself clean so derivation stays simple
- [React docs: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
