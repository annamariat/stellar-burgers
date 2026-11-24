import { selectFeedOrders } from '@selectors/feedSelectors';
import { selectIngredients } from '@selectors/ingredientsSelectors';
import { selectCurrentOrder, selectProfileOrders } from '@selectors/ordersSelectors';
import { fetchOrderByNumber } from '@slices/ordersSlice';
import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

import type { TIngredient, TOrder } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);

  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const currentOrder = useSelector(selectCurrentOrder);

  const orderData: TOrder | undefined =
    feedOrders.find((o) => o.number === orderNumber) ??
    profileOrders.find((o) => o.number === orderNumber) ??
    (currentOrder?.number === orderNumber ? currentOrder : undefined);

  const isFound = Boolean(orderData);

  useEffect(() => {
    if (!isFound && orderNumber) {
      void dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, isFound, orderNumber]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
