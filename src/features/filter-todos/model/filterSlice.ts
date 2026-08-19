import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FilterStatus } from './types';

const initialState = {
  status: 'all' as FilterStatus,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    filterChanged(state, action: PayloadAction<FilterStatus>) {
      state.status = action.payload;
    },
  },
});

export const { filterChanged } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
