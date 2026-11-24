import { selectUpdateError, selectUser } from '@selectors/userSelectors';
import { clearUserErrors, updateUser } from '@slices/userSlice';
import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const updateError = useSelector(selectUpdateError);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  useEffect(() => {
    dispatch(clearUserErrors());
  }, [dispatch]);

  /* Подставляем данные пользователя в форму (и после сохранения) */
  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    /* Пароль отправляем только если его ввели */
    const data = {
      name: formValue.name,
      email: formValue.email,
      ...(formValue.password ? { password: formValue.password } : {}),
    };
    void dispatch(updateUser(data));
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateError ?? undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
