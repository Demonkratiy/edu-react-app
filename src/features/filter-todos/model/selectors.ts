import type { RootState } from '@/app/store';
import { selectTodos } from '@/entities/todo';
import { createSelector } from '@reduxjs/toolkit';

// Basic selector: reads the filter slice's value out of the whole state.
export const selectFilterStatus = (state: RootState) => state.filter.status;

export const selectFilteredTodos = createSelector(
  [selectFilterStatus, selectTodos],
  (filterStatus, todos) => {
    switch (filterStatus) {
      case 'completed':
        return todos.filter((todo) => todo.completed);
      case 'active':
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  },
);
