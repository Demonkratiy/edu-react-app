# Barrel files

A **barrel file** is an `index.ts` (or `index.js`) that re-exports the public API of a folder/module, so consumers can import from one place instead of reaching into individual files.

```ts
// src/shared/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Checkbox } from './Checkbox';
```

```tsx
// Without barrel
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

// With barrel
import { Button, Input } from '@/shared/ui';
```

## When to use

Use a barrel **at module boundaries** — places where you want to expose a clear public API and hide internal structure:

- ✅ UI kit / design system (`src/shared/ui`)
- ✅ Utilities and hooks (`src/shared/lib`)
- ✅ Per-component folder (`src/shared/ui/Button/index.ts`) — hides that the file is `Button/Button.tsx`
- ✅ FSD slice public API (`src/entities/todo/index.ts`) — exposes only what the slice offers outward

Avoid barrels where there is no clear module boundary:

- ❌ Aggregating unrelated modules under one root barrel (the old flat `src/components/`) — too heterogeneous to be a single module
- ❌ Re-exporting a slice's internals beyond its public API — the slice `index.ts` is the boundary; don't add deeper cross-slice barrels

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

- `src/shared/ui/index.ts` — barrel for the UI kit
- `src/shared/ui/<Component>/index.ts` — barrel that hides the inner file structure of the component folder
- `src/<layer>/<slice>/index.ts` — public API barrel for each FSD slice (entities, features, widgets, pages)
- Inside a slice, files import each other by direct path; only outside consumers use the slice barrel
