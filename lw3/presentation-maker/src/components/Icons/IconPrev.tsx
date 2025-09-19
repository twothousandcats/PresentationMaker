import style from './Icons.module.css';

export default function IconPrev() {
    return (
        <svg className={style.icon}
             width="24"
             height="24"
             viewBox="-0.5 0 25 25"
             fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <path d="M10.2741 11.725L6.54411 7.93501C6.35411 7.74501 6.35411 7.42501 6.54411 7.23501L10.2741 3.44501"
                  stroke="none"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path
                d="M11.9241 21.555C15.7141 20.815 18.1941 17.095 17.4741 13.235C16.7541 9.37501 13.0941 6.84501 9.30408 7.58501"
                stroke="none"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"/>
        </svg>
    );
}