import type { RootState } from '@/app/store';

// Basic selector: reads the todos slice's items out of the whole state.
export const selectTodos = (state: RootState) => state.todos.items;
