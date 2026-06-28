import { configureStore } from '@reduxjs/toolkit';
import { todoReducer } from '@/entities/todo';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

// Inferred from the store itself so the types always match the real reducers.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
