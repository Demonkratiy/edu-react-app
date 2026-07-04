# Domain in software design

## What is a domain

The **domain** is the problem area an application solves — the entities, rules, and concepts the app is built around.

| App            | Domain                             |
| -------------- | ---------------------------------- |
| TODO app       | Tasks, statuses, deadlines         |
| E-commerce     | Products, orders, cart, users      |
| Banking        | Accounts, transactions, currencies |
| Social network | Posts, comments, likes, friends    |

In code, the domain is usually expressed via **types** and **business rules**:

```ts
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}
```

## Domain-agnostic vs domain-specific components

Components fall into two categories:

### Domain-agnostic (UI kit)

Knows nothing about the app's business domain. Reusable in any project.

- `Button`, `Input`, `Checkbox`, `Modal`...
- Accepts primitive props: `string`, `boolean`, `ReactNode`.
- Should never import domain types.

```tsx
<Button onClick={...}>Click</Button>
```

### Domain-specific (business components)

By design works with domain entities. Cannot be reused outside the project.

- `TodoItem`, `TodoList`, `AddTodoForm`, `ProductCard`, `OrderRow`...
- Accepts domain types as props.
- Lives in `src/components/` (not in `src/components/ui/`).

```tsx
<TodoItem todo={todo} onToggle={...} onDelete={...} />
```

## Folder convention

```
src/components/
├── ui/                # domain-agnostic
│   ├── Button/
│   ├── Input/
│   └── Checkbox/
├── TodoItem/          # domain-specific
├── TodoList/
└── AddTodoForm/
```

## Heuristic

> The deeper a component sits in the business layer, the more it's allowed to know about domain types.
>
> A UI-kit component should never import a domain type. A domain component normally should.

## Why this separation matters

- **Reusability** — UI kit can move to another project untouched.
- **Refactor-friendly** — change the domain shape, and only domain components break.
- **Easier testing** — UI kit tests are pure render tests; domain components are tested with realistic data.
