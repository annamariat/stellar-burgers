import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute,
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import {
  selectIngredientsError,
  selectIngredientsLoading,
} from '@selectors/ingredientsSelectors';
import { fetchIngredients } from '@slices/ingredientsSlice';
import { checkUserAuth } from '@slices/userSlice';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

const formatOrderNumber = (number?: string): string =>
  number ? `#${number.padStart(6, '0')}` : '';

const OrderPage = (): React.JSX.Element => {
  const { number } = useParams();

  return (
    <div className={styles.detailPageWrap}>
      <h3 className={`${styles.detailHeader} text text_type_digits-default`}>
        {formatOrderNumber(number)}
      </h3>
      <OrderInfo />
    </div>
  );
};

const OrderModal = ({ onClose }: { onClose: () => void }): React.JSX.Element => {
  const { number } = useParams();

  return (
    <Modal title={formatOrderNumber(number)} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};

const IngredientPage = (): React.JSX.Element => (
  <div className={styles.detailPageWrap}>
    <h3 className={`${styles.detailHeader} text text_type_main-large`}>
      Детали ингредиента
    </h3>
    <IngredientDetails />
  </div>
);

const App = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  const background = (location.state as { background?: Location } | null)?.background;

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  const closeModal = (): void => {
    void navigate(-1);
  };

  if (isLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <p className={`${styles.message} text text_type_main-medium`}>
          Не удалось загрузить ингредиенты{error.message ? `: ${error.message}` : '.'}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:number" element={<OrderPage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route path="/feed/:number" element={<OrderModal onClose={closeModal} />} />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <OrderModal onClose={closeModal} />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
