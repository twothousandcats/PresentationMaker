import style from './Icons.module.css';

export default function IconAlignCenter() {
  return (
    <svg
      className={style.icon}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 10H6M21 6H3M21 14H3M18 18H6"
        stroke="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
