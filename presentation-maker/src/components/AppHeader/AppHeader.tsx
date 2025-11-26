import style from './AppHeader.module.css';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher.tsx';
import { LANGUAGES } from '../../store/utils/langs.ts';
import IconLogout from '../Icons/IconLogout.tsx';

type AppHeaderProps = {
  onLogout?: () => void;
  isAuth?: boolean;
};

export const AppHeader = ({ onLogout, isAuth }: AppHeaderProps) => {
  return (
    <div className={style.logoWrapper}>
      <h1 className={style.logo}>{LANGUAGES.ru.projectName}</h1>
      <ul className={style.handlers}>
        {isAuth && (
          <li className={style.logout} onClick={onLogout}>
            <IconLogout />
            {LANGUAGES.ru.logout}
          </li>
        )}
        <ThemeSwitcher />
      </ul>
    </div>
  );
};
