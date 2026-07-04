import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { filterChanged } from '@/features/filter-todos/model/filterSlice';
import { selectFilterStatus } from '@/features/filter-todos/model/selectors';
import type { FilterStatus } from '@/features/filter-todos/model/types';

const OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export const TodoFilter = () => {
  const filterStatus = useAppSelector(selectFilterStatus);
  const dispatch = useAppDispatch();
  const setFilter = (status: FilterStatus) => dispatch(filterChanged(status));
  return (
    <div role='group' aria-label='Filter todos' className='inline-flex divide-x divide-gray-300'>
      {OPTIONS.map((option) => {
        const isActive = filterStatus === option.value;
        return (
          <button
            key={option.value}
            type='button'
            aria-pressed={isActive}
            onClick={() => setFilter(option.value)}
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
