import style from './Toolbar.module.css';

export default function Toolbar() {
    return (
        <ul className={style.toolbar}>
            <li className={style.toolbar__item}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#000000"
                          d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2Z"/>
                </svg>
            </li>
        </ul>
    )
}