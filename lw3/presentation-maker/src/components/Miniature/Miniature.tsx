import style from './Miniature.module.css';
import type {
    Slide
} from "../../types/types.ts";

type MiniatureProps = {
    slideData: Slide,
    isActive: boolean,
}

export default function Miniature({slideData, isActive}: MiniatureProps) {

    return (
        <div className={`${style.slide__wrapper} ${isActive ? style.slide__wrapper_active : ''}`}>

        </div>
    );
}