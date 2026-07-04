import type { InputHTMLAttributes } from 'react';

// Omit<T, K> — utility type that copies T but removes the listed keys K.
// Here we drop `type` so consumers can't pass `type="text"` and break the checkbox —
// we always set type="checkbox" inside the component.
export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Checkbox = ({ disabled, ...rest }: CheckboxProps) => {
  return (
    <input
      type='checkbox'
      disabled={disabled}
      className='size-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200'
      {...rest}
    />
  );
};
