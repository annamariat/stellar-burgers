//**Слайс ингредиентов

//Создай папку src/services/slices (алиас @slices уже есть в tsconfig) и файл src/services/slices/ingredientsSlice.ts: */

import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { SerializedError } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils-types';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const ingredientsReducer = ingredientsSlice.reducer;
