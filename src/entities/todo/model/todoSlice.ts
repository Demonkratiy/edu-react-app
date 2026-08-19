import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from './types';

interface TodosState {
  items: Todo[];
}

const initialState: TodosState = {
  items: [],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // `prepare` lets the caller pass just the text; the id is generated here,
    // so the action stays a description of "what happened" and the component
    // does not need to know how ids are made.
    todoAdded: {
      reducer(state, action: PayloadAction<Todo>) {
        state.items.push(action.payload);
      },
      prepare(text: string) {
        return {
          payload: { id: crypto.randomUUID(), text, completed: false } satisfies Todo,
        };
      },
    },
    todoToggled(state, action: PayloadAction<string>) {
      const todo = state.items.find((item) => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    todoDeleted(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { todoAdded, todoToggled, todoDeleted } = todoSlice.actions;
export const todoReducer = todoSlice.reducer;
