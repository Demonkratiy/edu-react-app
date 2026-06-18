# Tailwind CSS

## Mental model

Tailwind classes are 1-to-1 mappings of CSS properties. There's no new "language" — you translate what you'd write in CSS.

| CSS | Tailwind |
|-----|----------|
| `display: flex` | `flex` |
| `align-items: center` | `items-center` |
| `padding: 8px` | `p-2` |
| `padding-inline: 16px` | `px-4` |
| `gap: 12px` | `gap-3` |
| `color: #6b7280` | `text-gray-500` |

## Spacing scale

Almost all sizes (padding, margin, gap, width, height) use the scale `0..96`, step = `0.25rem` (4px).

| Class | Value |
|-------|-------|
| `p-0` | 0 |
| `p-1` | 4px |
| `p-2` | 8px |
| `p-4` | 16px |
| `p-8` | 32px |

Rule of thumb: `N → N * 4px`.

## Colors

Palette: `gray`, `red`, `blue`, `green`, `yellow`, `purple`, `pink`, etc.
Brightness scale: `50, 100, 200, ..., 900, 950`. Higher = darker.

## Essential classes for 80% of cases

| Category | Classes |
|----------|---------|
| Layout | `flex`, `grid`, `block`, `inline-block`, `hidden` |
| Flex | `items-center`, `justify-between`, `gap-2`, `flex-1`, `flex-col` |
| Spacing | `p-{N}`, `px-`, `py-`, `m-`, `mx-`, `gap-` |
| Sizing | `w-full`, `w-{N}`, `max-w-md`, `min-w-0`, `size-4` |
| Text | `text-{color}-{shade}`, `text-sm/base/lg`, `font-medium/bold`, `text-center` |
| Border | `border`, `border-gray-300`, `rounded`, `rounded-lg` |
| Background | `bg-{color}-{shade}` |
| State prefixes | `hover:`, `focus:`, `disabled:` |

## Tailwind v4 — key renames

Some classes were renamed in v4. The IDE warns about the old names.

| v3 (deprecated) | v4 |
|-----------------|-----|
| `break-words` | `wrap-break-word` |
| `break-normal` | `wrap-normal` |
| New in v4 | `wrap-anywhere` (allows breaking inside words for layout purposes) |

## Common gotcha: long content overflows a flex container

By default, a flex item refuses to shrink below the width of its content. A long unbroken string inside a flex child blows out the entire layout — even with `wrap-break-word`.

**Fix — combine two classes:**

```tsx
<div className="flex gap-2">
  <div className="min-w-0">          {/* allow this flex child to shrink */}
    <span className="wrap-anywhere"> {/* allow breaking inside words */}
      {potentiallyVeryLongText}
    </span>
  </div>
  <Button>Action</Button>
</div>
```

- `min-w-0` on the **flex child** unlocks shrinking below content width.
- `wrap-anywhere` on the **text** allows breaking inside words.

Without `min-w-0`, the wrap rules can't take effect because the flex item insists on its content width.

## Useful tools

- [Tailwind docs](https://tailwindcss.com/docs) — fast search by CSS property name.
- VS Code extension: **Tailwind CSS IntelliSense** — autocomplete and warnings.
- [Cheat sheet](https://nerdcave.com/tailwind-cheat-sheet) — one-page reference.

## Combining classes conditionally

Three common patterns:

```tsx
// 1. Template literal
className={`base-classes ${condition ? 'active' : ''}`}

// 2. Array + filter + join
className={['base', condition && 'active'].filter(Boolean).join(' ')}

// 3. clsx / classnames library (recommended for many conditions)
import clsx from 'clsx'
className={clsx('base', { active: condition })}
```
