import { selectAuthError } from '@selectors/userSelectors';
import { clearUserErrors, loginUser } from '@slices/userSlice';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* Сбрасываем старую ошибку при открытии страницы */
  useEffect(() => {
    dispatch(clearUserErrors());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
