import style from './ThemeSwitcher.module.css';
import IconSun from '../Icons/IconSun.tsx';
import IconMoon from '../Icons/IconMoon.tsx';
import { useContext } from 'react';
import { ThemeContext } from '../../main.tsx';
import { concatModifiersByFlag } from '../../store/utils/functions.ts';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const themeClass = concatModifiersByFlag([
    style.themeSwitcher,
    theme === 'light' ? style.light : style.dark,
  ]);
  return (
      <li className={themeClass}
          onClick={toggleTheme}>
        {theme === 'light' ? <IconSun /> : <IconMoon />}
      </li>
  );
}
