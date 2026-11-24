import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

type TOrdersState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
  profileOrders: TOrder[];
  isProfileOrdersLoading: boolean;
  currentOrder: TOrder | null;
};

const initialState: TOrdersState = {
  orderRequest: false,
  orderModalData: null,
  orderError: null,
  profileOrders: [],
  isProfileOrdersLoading: false,
  currentOrder: null,
};

export const createOrder = createAsyncThunk('orders/create', async (ids: string[]) => {
  const res = await orderBurgerApi(ids);
  return res.order;
});

export const fetchProfileOrders = createAsyncThunk('orders/fetchProfile', getOrdersApi);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0] ?? null;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.orderError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message ?? 'Не удалось оформить заказ';
      })
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isProfileOrdersLoading = true;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isProfileOrdersLoading = false;
        state.profileOrders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state) => {
        state.isProfileOrdersLoading = false;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      });
  },
});

export const { clearOrderModal } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
