import style from './MiniatureContainer.module.css';
import Miniature from "../Miniature/Miniature.tsx";
import type {Presentation} from "../../types/types.ts";

export default function MiniatureContainer(props: Presentation) {
    return (
        <ul className={style.container}>
            {props.slides.length > 0 && props.slides.map((slide, index) =>
                <li className={style.holder}
                    key={slide.id}
                    onClick={
                        () => {
                            console.log('Порядковый номер: ', index);
                            console.log('id: ', slide.id);
                        }
                    }>
                    <p className={style.holder__num}>
                        {index + 1}
                    </p>
                    <Miniature {...slide} />
                </li>
            )}
        </ul>
    );
}