import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Typed wrappers around the React-Redux hooks. Use these throughout the app
// instead of the plain useDispatch / useSelector so dispatch and selectors are
// fully typed against our store.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
