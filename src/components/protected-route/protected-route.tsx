import { selectIsAuthChecked, selectUser } from '@selectors/userSelectors';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '@services/store';

import type { ReactElement } from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: ProtectedRouteProps): ReactElement => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  /* Пока не знаем, залогинен ли пользователь, показываем прелоадер */
  if (!isAuthChecked) {
    return <Preloader />;
  }

  /* Страницы для гостей (логин, регистрация...): авторизованного отправляем назад */
  if (onlyUnAuth && user) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from;
    return <Navigate to={from?.pathname ?? '/'} replace />;
  }

  /* Закрытые страницы: гостя отправляем на логин, запомнив, откуда он пришёл */
  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
