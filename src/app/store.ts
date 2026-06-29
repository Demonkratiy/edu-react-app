import { todoReducer } from '@/entities/todo';
import { filterReducer } from '@/features/filter-todos';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    filter: filterReducer,
  },
});

// Inferred from the store itself so the types always match the real reducers.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
