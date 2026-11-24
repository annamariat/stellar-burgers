import type { RootState } from '../store';
import type { SerializedError } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils-types';

export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.items;
export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState): SerializedError | null =>
  state.ingredients.error;
