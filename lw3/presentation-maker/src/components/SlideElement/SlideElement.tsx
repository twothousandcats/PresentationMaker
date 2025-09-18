import style from './SlideElement.module.css';
import type {SlideElement} from "../../types/types.ts";

export default function SlideElement(element: SlideElement) {
    const curElement = {...element};
    return (
        <div className={style.element}
        style={{
            top: curElement.position.y,
            left: curElement.position.x,
            width: curElement.size.width,
            height: curElement.size.height,
        }}></div>
    );
}