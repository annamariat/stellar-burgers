import { selectAuthError } from '@selectors/userSelectors';
import { clearUserErrors, registerUser } from '@slices/userSlice';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const Register = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(clearUserErrors());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(registerUser({ name: userName, email, password }));
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
