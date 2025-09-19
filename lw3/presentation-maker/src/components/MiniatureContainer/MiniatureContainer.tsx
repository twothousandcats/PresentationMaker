import style from './MiniatureContainer.module.css';
import Miniature from "../Miniature/Miniature.tsx";
import type {Presentation} from "../../types/types.ts";

export default function MiniatureContainer(props: Presentation) {
    const pres = {...props};

    return (
        <ul className={style.container}>
            {pres.slides.length > 0 && pres.slides.map((slide, index) =>
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
                    <Miniature
                        {...slide}
                        isActive={pres.selection.selectedSlideIds.includes(slide.id)}
                    />
                </li>
            )}
        </ul>
    );
}