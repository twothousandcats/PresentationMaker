import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Loader } from '../Loader/Loader.tsx';
import { isAuthenticated, logout } from '../../api/authService.ts';
import { AppHeader } from '../AppHeader/AppHeader.tsx';
import { PAGES_URL } from '../../store/utils/config.ts';

export const ProtectedLayout = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const auth = await isAuthenticated();
      setIsAuth(auth);
      setLoading(false);
      if (!auth) navigate(PAGES_URL.loginPage, { replace: true });
    };
    check();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(PAGES_URL.loginPage, { replace: true });
  };

  if (!isAuth) {
    return null;
  }

  return (
    <>
      <AppHeader isAuth={isAuth} onLogout={handleLogout} />
      {loading ? <Loader /> : <Outlet />}
    </>
  );
};
