import { selectConstructorItems } from '@selectors/constructorSelectors';
import { selectOrderModalData, selectOrderRequest } from '@selectors/ordersSelectors';
import { selectUser } from '@selectors/userSelectors';
import { resetConstructor } from '@slices/constructorSlice';
import { fetchFeed } from '@slices/feedSlice';
import { clearOrderModal, createOrder, fetchProfileOrders } from '@slices/ordersSlice';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }

    const ids = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    void dispatch(createOrder(ids))
      .unwrap()
      .then(() => {
        dispatch(resetConstructor());
        void dispatch(fetchFeed());
        void dispatch(fetchProfileOrders());
      })
      .catch(() => undefined);
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
