import type { RootState } from '../store';
import type { TUser } from '@utils-types';

export const selectUser = (state: RootState): TUser | null => state.user.user;
export const selectUserName = (state: RootState): string | undefined =>
  state.user.user?.name;
export const selectIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;
export const selectUserLoading = (state: RootState): boolean => state.user.isLoading;
export const selectAuthError = (state: RootState): string | null => state.user.authError;
export const selectUpdateError = (state: RootState): string | null =>
  state.user.updateError;
