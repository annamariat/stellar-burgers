import type { RootState } from '../store';
import type { TOrder } from '@utils-types';

export const selectOrderRequest = (state: RootState): boolean =>
  state.orders.orderRequest;
export const selectOrderModalData = (state: RootState): TOrder | null =>
  state.orders.orderModalData;
export const selectProfileOrders = (state: RootState): TOrder[] =>
  state.orders.profileOrders;
export const selectCurrentOrder = (state: RootState): TOrder | null =>
  state.orders.currentOrder;
