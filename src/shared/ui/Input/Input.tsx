import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = ({ invalid = false, className = '', ...rest }: InputProps) => {
  const base =
    'w-full rounded border px-3 py-2 text-base outline-none transition-colors focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const state = invalid
    ? 'border-red-500 focus:ring-red-300'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';

  return <input className={[base, state, className].join(' ')} {...rest} />;
};
