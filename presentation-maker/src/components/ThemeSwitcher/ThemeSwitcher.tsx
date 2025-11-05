import style from './ThemeSwitcher.module.css';
import IconSun from "../Icons/IconSun.tsx";
import IconMoon from "../Icons/IconMoon.tsx";
import {useContext} from "react";
import {ThemeContext} from "../../main.tsx";
import {concatModifiersByFlag} from "../../store/functions/untils/utils.ts";

export default function ThemeSwitcher() {
    const {theme, toggleTheme} = useContext(ThemeContext);
    const themeClass = concatModifiersByFlag(
        [
            style.theme,
            theme === 'light'
            ? style.light
            : style.dark]);
    return (
        <ul className={style.themeSwitcher}
            onClick={toggleTheme}>
            <li className={themeClass}>
                {theme === 'light'
                    ? (<IconSun/>)
                    : (<IconMoon/>)
                }
            </li>
        </ul>
    );
}