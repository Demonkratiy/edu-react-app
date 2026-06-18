# Barrel files

A **barrel file** is an `index.ts` (or `index.js`) that re-exports the public API of a folder/module, so consumers can import from one place instead of reaching into individual files.

```ts
// src/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Checkbox } from './Checkbox';
```

```tsx
// Without barrel
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// With barrel
import { Button, Input } from '@/components/ui';
```

## When to use

Use a barrel **at module boundaries** — places where you want to expose a clear public API and hide internal structure:

- ✅ UI kit / design system (`src/components/ui`)
- ✅ Hooks collection (`src/hooks`)
- ✅ Utilities (`src/utils`)
- ✅ Per-component folder (`src/components/ui/Button/index.ts`) — hides that the file is `Button/Button.tsx`

Avoid barrels where there is no clear module boundary:

- ❌ Business / domain components (`TodoItem`, `AddTodoForm`) — each has its own context, no shared API surface
- ❌ Root `src/components/` — too heterogeneous to be a single module

**Rule of thumb:** barrels stop at the module boundary, they don't go all the way down.

## Tradeoffs

### Tree-shaking

When you import a single export from a barrel, the bundler must prove that the other re-exports have no side effects in order to drop them. Modern bundlers (Vite, esbuild, Rollup) are usually fine, but:

- Be careful with side-effectful modules (CSS imports, polyfills, code that runs at module load).
- In large apps the barrel can defeat tree-shaking and inflate bundles.

You can hint to the bundler by setting `"sideEffects": false` (or a list) in `package.json`.

### Circular dependencies

If components inside `ui/` import each other through the barrel instead of by direct path, you can create a cycle:

```
Button → ui/index → Input → ui/index → Button
```

**Inside the same module, always import by direct path.** Only consumers outside the module should use the barrel.

### Dev / HMR performance

Every change inside the module invalidates the barrel, which invalidates all of its consumers. In small projects this is invisible; in large ones it slows hot reload.

### IDE auto-import ambiguity

The IDE may suggest two paths for the same symbol — through the barrel and directly. Pick one convention for the team and stick to it (typically: barrel for outside consumers, direct path inside the module).

## Project convention

- `src/components/ui/index.ts` — barrel for the UI kit
- `src/components/ui/<Component>/index.ts` — barrel that hides the inner file structure of the component folder
- No barrels for business components or for the `src/components/` root
- Inside `ui/`, components import each other by direct path, not via the UI-kit barrel
