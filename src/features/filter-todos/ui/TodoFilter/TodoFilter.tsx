import type { FilterStatus } from '@/features/filter-todos/model/types';

const OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

interface TodoFilterProps {
  status: FilterStatus;
  onChange: (status: FilterStatus) => void;
}

export const TodoFilter = ({ status, onChange }: TodoFilterProps) => {
  return (
    <div role='group' aria-label='Filter todos' className='inline-flex divide-x divide-gray-300'>
      {OPTIONS.map((option) => {
        const isActive = status === option.value;
        return (
          <button
            key={option.value}
            type='button'
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer px-3 py-1 text-sm font-medium transition-colors first:rounded-l last:rounded-r ${
              isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
