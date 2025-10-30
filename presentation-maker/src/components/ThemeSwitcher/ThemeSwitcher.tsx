import style from './ThemeSwitcher.module.css';
import IconSun from "../Icons/IconSun.tsx";
import IconMoon from "../Icons/IconMoon.tsx";
import {useContext} from "react";
import {ThemeContext} from "../../main.tsx";

export default function ThemeSwitcher() {
    const {theme, toggleTheme} = useContext(ThemeContext);

    return (
        <ul className={style.themeSwitcher}
                onClick={toggleTheme}>
            {theme === 'light' ? (<IconSun/>) : (<IconMoon/>)}
        </ul>
    );
}