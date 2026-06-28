# Co-location of types and code

**Co-location** = put related code physically next to where it's used. The opposite is "central files" that collect related items by kind (`types/`, `constants/`, `utils/`) regardless of who uses them.

The right balance is the heuristic in this note.

## The rule

> A piece of code lives **as close as possible** to its only consumer. It moves into a shared location **only when** it has multiple consumers across unrelated parts of the codebase.

Two consumers in the same module = still co-locate. Two consumers in different domains = move it up.

## Applied to types

A common mistake is to dump every interface into `src/types/`. That folder turns into a junk drawer where nothing has clear ownership.

**Where each kind of type belongs:**

| Type                                                  | Location                                 | Why                                                                   |
| ----------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| Domain entities (`Todo`, `User`, `Order`)             | `entities/<entity>/model/types.ts`       | Describe the problem space; owned by the entity slice, used across the app. |
| Component props (`TodoItemProps`, `AddTodoFormProps`) | Inside the component file                | Implementation detail of one component, has exactly one consumer.     |
| API response shapes                                   | Next to the API client that fetches them | Coupled to the network boundary.                                      |
| Internal helper types                                 | At the top of the file that uses them    | Private.                                                              |

### Example

`src/entities/todo/model/types.ts` — only the domain entity:

```ts
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type { Todo };
```

`src/entities/todo/ui/TodoItem/TodoItem.tsx` — props live with the component:

```tsx
import type { Todo } from '@/entities/todo/model/types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  // ...
};
```

## Why co-locate

- **Single source of truth per concept.** Looking at a component, you see its full API without jumping to another file.
- **Refactor-safe.** Renaming or deleting the component takes its types with it. Nothing is left orphaned.
- **No coupling pressure.** When props live in a shared file, two unrelated components start to depend on each other "by accident" because they share an import path.
- **Faster IDE and TS performance.** Smaller, focused files are easier for tools to process.

## When to move something out

Promote to a shared location when **at least two unrelated** files need it. Symptoms:

- Same interface copy-pasted in two components.
- A new file imports from a component file just for a type.
- The shape is part of an external contract (API, library boundary).

Default to keeping things local. Promote later when the duplication actually appears — not preemptively.

## Applied beyond types

The same rule scales:

- **Constants**: `MAX_TITLE_LENGTH` used only by `TodoItem` lives at the top of `TodoItem.tsx`. Move to `constants/` only if other code starts to use it.
- **Helper functions**: `formatDueDate` used only by one component stays in that file. Promote to `utils/` after the second consumer appears.
- **Sub-components**: a small `<Avatar>` used only inside `<UserCard>` can live in `UserCard.tsx`. Extract to its own file when reused.

## Anti-pattern: "kitchen sink" files

Watch out for files that grow to match a _folder name_ rather than a real concept:

- `types/index.ts` exporting hundreds of unrelated types.
- `utils/helpers.ts` with functions that have nothing in common.
- `constants/index.ts` with dozens of unrelated values.

These are signs that the rule was reversed: things were grouped by **kind** instead of by **purpose**. Refactor by moving each item back next to its real owner; what's left after that exercise is the actual shared code.

## Project convention

- `src/types/` contains **only** domain entities used by multiple consumers.
- Component props live inside the component file.
- Shared utilities are promoted only after a real second use case.
