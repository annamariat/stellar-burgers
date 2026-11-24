import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      // id нужен, чтобы одинаковые ингредиенты можно было различать в списке
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index <= 0) return;
      [state.ingredients[index - 1], state.ingredients[index]] = [
        state.ingredients[index],
        state.ingredients[index - 1],
      ];
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= state.ingredients.length - 1) return;
      [state.ingredients[index], state.ingredients[index + 1]] = [
        state.ingredients[index + 1],
        state.ingredients[index],
      ];
    },
    resetConstructor: () => initialState,
  },
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor,
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
