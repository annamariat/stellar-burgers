import { selectFeedOrders } from '@selectors/feedSelectors';
import { fetchFeed } from '@slices/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);

  useEffect(() => {
    void dispatch(fetchFeed());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeed());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
