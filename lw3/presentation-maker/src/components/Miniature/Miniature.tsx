import style from './Miniature.module.css';
import type {
    Slide
} from "../../types/types.ts";

export default function Miniature(props: Slide) {
    return (
        <div className={style.slide__wrapper}></div>
    );
}