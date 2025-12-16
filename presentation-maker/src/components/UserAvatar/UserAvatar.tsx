import style from './UserAvatar.module.css';
import { getCurrentUser } from '../../lib/authService.ts';
import { useEffect, useState } from 'react';
import {
  generateAvatarColor,
} from '../../store/utils/functions.ts';

export const UserAvatar = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading ||!user || (!user.email && !user.name)) {
    return null;
  }

  const firstLetter = user.name.trim().charAt(0).toUpperCase();
  const bgColor = generateAvatarColor(user.email);
  const letterColor = generateAvatarColor(user.name);

  return (
    <li className={style.avatar}
        title={user?.name}
    style={{
      color: letterColor,
      backgroundColor: bgColor,
    }}>
      {firstLetter}
    </li>
  );
}