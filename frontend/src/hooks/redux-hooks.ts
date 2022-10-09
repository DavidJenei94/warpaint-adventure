import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
// Provides to not to write types in useAppSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
