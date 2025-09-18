import style from './Miniature.module.css';
import type {
    Slide
} from "../../types/types.ts";

export default function Miniature(props: Slide) {
    const slide = {...props};

    return (
        <li className={style.slide}
            onClick={
                () => {
                    console.log(slide.id);
                }
            }>
            <p className={style.slide__num}>{slide.id}</p>
            <div className={style.slide__wrapper}></div>
        </li>
    );
}