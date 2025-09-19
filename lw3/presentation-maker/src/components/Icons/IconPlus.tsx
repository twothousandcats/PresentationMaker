import style from './Icons.module.css';

export default function IconPlus() {
    return (
        <svg className={style.icon}
             width="24"
             height="24"
             viewBox="0 0 24 24"
             fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12H18M12 6V18"
                  stroke="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>
    );
}