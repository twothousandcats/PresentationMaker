import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../lib/authService.ts';
import { PAGES_URL } from '../../store/utils/config.ts';
import { Loader } from '../Loader/Loader.tsx';

export const GuestOnlyLayout = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndRedirect = async () => {
      const auth = await isAuthenticated();
      if (isMounted) {
        if (auth) {
          navigate(PAGES_URL.collectionPage, { replace: true });
        } else {
          setLoading(false);
        }
      }
    };

    checkAuthAndRedirect();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (loading) {
    return <Loader />;
  }

  return <Outlet />;
};
