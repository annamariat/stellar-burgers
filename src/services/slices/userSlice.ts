import {
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  updateUserApi,
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteCookie, getCookie, setCookie } from '@utils/cookie';

import type { TLoginData, TRegisterData } from '@api';
import type { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  authError: string | null;
  updateError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  authError: null,
  updateError: null,
};

const saveTokens = (accessToken: string, refreshTokenValue: string): void => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshTokenValue);
};

const clearTokens = (): void => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    saveTokens(res.accessToken, res.refreshToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk('user/login', async (data: TLoginData) => {
  const res = await loginUserApi(data);
  saveTokens(res.accessToken, res.refreshToken);
  return res.user;
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  clearTokens();
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

/* Проверка при старте приложения: есть ли сохранённая сессия */
export const checkUserAuth = createAsyncThunk('user/checkAuth', async () => {
  const hasAccess = Boolean(getCookie('accessToken'));
  const hasRefresh = Boolean(localStorage.getItem('refreshToken'));

  if (!hasAccess && !hasRefresh) return null;

  if (!hasAccess) {
    await refreshToken();
  }

  const res = await getUserApi();
  return res.user;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserErrors: (state) => {
      state.authError = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // регистрация
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.authError = action.error.message ?? 'Не удалось зарегистрироваться';
      })
      // вход
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.authError = action.error.message ?? 'Не удалось войти';
      })
      // выход
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      // обновление профиля
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.updateError = action.error.message ?? 'Не удалось сохранить данные';
      })
      // проверка сессии при старте
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        clearTokens();
        state.user = null;
        state.isAuthChecked = true;
      });
  },
});

export const { clearUserErrors } = userSlice.actions;
export const userReducer = userSlice.reducer;
