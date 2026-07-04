# Internal vs external layout

A core composition principle: **a component owns the layout _inside_ itself, the parent owns _where_ the component sits**. Mixing these two responsibilities is the source of most "this component is hard to reuse" pain.

## The two layers

| Layer           | What                                                                 | Owned by                             |
| --------------- | -------------------------------------------------------------------- | ------------------------------------ |
| Internal layout | How the component's own children are arranged relative to each other | The component itself                 |
| External layout | Width, margin, position on the page, surrounding spacing             | The parent that places the component |

A reusable component must **not** know about its outer context, because that context changes every time it's reused.

## What belongs inside

- `display: flex` / `grid` between own children
- `gap`, alignment (`items-*`, `justify-*`)
- Padding inside the component (the "inset" between border and content)
- Internal spacing between sub-elements

These describe how the component looks **as a self-contained block**.

## What belongs outside

- `width`, `max-width`, `min-width`
- `margin` (especially margins between siblings)
- Absolute/fixed positioning relative to the page
- Z-index relative to siblings
- Whether the component takes a row in a flex parent or a column

These describe how the component **fits into a layout**, which only the parent knows.

## Example

A todo form should look like this:

```tsx
// AddTodoForm.tsx
export const AddTodoForm = ({ onAdd }: AddTodoFormProps) => {
  // ...
  return (
    <form onSubmit={handleSubmit} className='flex w-full items-start gap-2'>
      <Input className='flex-1' /* ... */ />
      <Button type='submit'>Add</Button>
    </form>
  );
};
```

- `flex items-start gap-2` — internal, the form is responsible for laying out its own input and button.
- `w-full` — "take whatever width you're given" — the form does **not** decide its own width.

The parent decides the actual width:

```tsx
// SomePage.tsx
<div className='mx-auto max-w-md'>
  <AddTodoForm onAdd={addTodo} />
</div>
```

Now the same `AddTodoForm` works in any context — narrow sidebar, modal dialog, full-width landing page. Each parent picks its own width.

## Anti-patterns

### A component that hard-codes its width

```tsx
// ❌ The form decides it should always be 400px
<form className="w-96 ...">
```

This breaks the moment a designer wants the form 600px wide on the dashboard and 320px in a modal. You either fight the component with `!important` overrides or fork it.

### A component with outer margin

```tsx
// ❌ The form pushes itself away from siblings
<form className="mt-8 mb-4 ...">
```

The parent now can't control spacing. Two such components placed next to each other create unpredictable gaps. **Margins between siblings are the parent's job** — typically via `gap` on a flex/grid container.

### Passing layout responsibility into props

```tsx
// ❌ Trying to externalize layout via props
<AddTodoForm width='400px' marginTop='32px' />
```

This rebuilds CSS on top of CSS. Just let the parent use a wrapper or pass `className`.

## Letting the parent influence styling: `className` passthrough

UI-kit components should accept `className` and pass it to the root element. This lets the parent attach external-layout classes without breaking encapsulation:

```tsx
// Input.tsx
export const Input = ({ className = '', ...rest }: InputProps) => {
  return <input className={[base, state, className].join(' ')} {...rest} />;
};
```

```tsx
// usage in another component
<Input className='flex-1' />
```

The parent adds `flex-1` for layout; the input keeps its own visual styles. Both layers stay separated.

## How to spot a violation

Ask:

> If I drop this component into a new page, will it look right with no extra wrapper?

Then ask:

> ...and will it look right in a _narrower_ container? In a _wider_ one? In a flex row?

If the answer requires removing or overriding existing classes from the component, the component is mixing internal and external concerns.

## Project convention

- Components style their internals only.
- Width, margin, and position come from the parent or a wrapper element.
- UI-kit components accept and forward `className` for external-layout tweaks.
