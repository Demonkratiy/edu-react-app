# Immutable state in React

React decides whether to re-render by **comparing the previous state with the new state by reference** (`Object.is`). If you mutate state in place, the reference stays the same — React thinks "nothing changed" and skips the re-render.

This is the single most important rule of React state management:

> **Never mutate state. Always produce a new value.**

Everything below is consequences of that rule.

## Why reference equality

Inside React, every `setState` call triggers roughly:

```js
if (Object.is(prevState, nextState)) {
  return; // no re-render
}
scheduleRerender();
```

For primitives this is straightforward — `5 === 5`, `'hello' === 'hello'`. For objects and arrays, equality is **by reference**:

```js
const a = [1, 2, 3];
const b = a; // same reference
const c = [1, 2, 3]; // different reference

Object.is(a, b); // true
Object.is(a, c); // false (despite identical content)
```

So if you mutate an array stored in state, then call `setState(theSameArray)`, React sees the same reference and skips work — even though the data inside changed. Your UI silently desyncs from your data.

## The mutation pitfall

```tsx
// ❌ Mutates in place — reference unchanged
const toggle = (id: string) => {
  const todo = todos.find((t) => t.id === id);
  todo.completed = !todo.completed;
  setTodos(todos); // todos === todos → no re-render
};

// ✅ Produces a new array + new object
const toggle = (id: string) => {
  setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
};
```

The rule applies to **all nesting levels**:

```js
// ❌ Mutates the inner object even though the outer array is new
setTodos([
  ...todos.map((t) => {
    if (t.id === id) t.completed = !t.completed;
    return t;
  }),
]);
```

The outer array is new, but `t.completed = ...` mutates the original object inside. Other code holding a reference to that todo (e.g. memoized children, devtools snapshots, undo history) sees its data change retroactively. Always create a new object at the level you're changing.

## Three immutable operations

For arrays in state, you need exactly three operations. Memorize the idioms.

### Add

```ts
setItems((prev) => [...prev, newItem]);
```

Spread creates a new array. `newItem` is appended.

To prepend: `[newItem, ...prev]`.

### Remove

```ts
setItems((prev) => prev.filter((item) => item.id !== id));
```

`filter` returns a new array. The matching item is excluded.

### Update one item

```ts
setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes } : item)));
```

`map` returns a new array. The matching item is replaced with a **new object** that spreads the old one and overrides specific fields. Other items pass through unchanged (same references — that's good, lets React skip work on them).

## Methods that mutate — don't use them on state

These all mutate the array they're called on:

| Method             | What it mutates     |
| ------------------ | ------------------- |
| `push`, `pop`      | End of the array    |
| `shift`, `unshift` | Start of the array  |
| `splice`           | Anywhere            |
| `sort`             | Reorders in place   |
| `reverse`          | Reverses in place   |
| `fill`             | Overwrites elements |

If you need any of these, copy first:

```ts
setItems((prev) => [...prev].sort(compare));
setItems((prev) => [...prev].reverse());
```

For objects, the same applies — `delete obj.key` mutates. Use destructuring:

```ts
const { [keyToRemove]: _, ...rest } = obj;
setObj(rest);
```

## Functional setState — when state depends on previous state

There are two ways to call a state setter:

```ts
setTodos(newValue); // value form
setTodos((prev) => computeFrom(prev)); // functional form
```

When the next value **depends on the current one** — always use the functional form.

### The closure pitfall

```tsx
const addTwo = () => {
  setTodos([...todos, todoA]); // todos = [] at this point
  setTodos([...todos, todoB]); // still [] — same closure capture
};
// Final state: only todoB, not both
```

Both calls reference the same `todos` variable captured when the handler ran. The first `setTodos` schedules a state update, but the local `todos` variable doesn't change — it's still the snapshot from when the handler started.

Functional form fixes this:

```tsx
const addTwo = () => {
  setTodos((prev) => [...prev, todoA]);
  setTodos((prev) => [...prev, todoB]);
};
// React applies them sequentially: prev in the second call is the result of the first
```

### Rule of thumb

If the new state is a transformation of the current state — `+1`, `[...prev, item]`, `prev.filter(...)`, `{ ...prev, key: value }` — use the functional form. **Default to it for state update handlers.**

The value form is fine only when the new state is a completely fresh value unrelated to the previous one:

```ts
setUser(null); // logout — value form is fine
setQuery(''); // reset
setItems(serverData); // replace with response
```

## Generating stable IDs

Items in lists need stable IDs (so `key` works correctly — see [Rendering patterns](./rendering-patterns.md)). Generate them **once, when the item is created**, not on every render.

Built into modern browsers:

```ts
crypto.randomUUID();
// => "550e8400-e29b-41d4-a716-446655440000"
```

No dependency, no boilerplate, globally unique. Use it everywhere you need a client-side ID. Older approaches (`Date.now()`, `Math.random()`, hand-rolled counters) are weaker — collisions, predictability, server-side issues.

## Quick checklist before changing state

1. Am I producing a **new** array/object, or modifying the old one?
2. If the array contains objects, am I replacing the modified object too, or just the array around it?
3. Does the new value depend on the previous one? If yes — functional `setX(prev => ...)`.
4. Am I using only `map` / `filter` / spread (`[...]`, `{...}`) — never `push` / `splice` / direct assignment?

If all four answers are right, React will re-render correctly and your data won't be silently aliased across renders.
