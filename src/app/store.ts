import { todoReducer } from '@/entities/todo';
import { filterReducer } from '@/features/filter-todos';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  todos: todoReducer,
  filter: filterReducer,
});

// Factory so tests and Storybook can spin up isolated stores (optionally with
// preloaded state) instead of sharing the app singleton.
export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({ reducer: rootReducer, preloadedState });
};

// The one store the running app uses.
export const store = setupStore();

// Types are derived from the root reducer / store, not written by hand.
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
