import type { RootState } from '../store';
import type { TConstructorState } from '@utils-types';

export const selectConstructorItems = (state: RootState): TConstructorState =>
  state.burgerConstructor;
