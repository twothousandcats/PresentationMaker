import style from './SlidesList.module.css';
import type {Presentation} from "../../store/types/types.ts";
import Slide from "../Slide/Slide.tsx";
import {dispatch} from "../../store/editor.ts";
import {setSelectedSlides} from "../../store/functions/functions.ts";

export default function SlidesList(pres: Presentation) {
        return (
        <ul className={style.container}>
            {pres.slides.length > 0 && pres.slides.map((slide, index) =>
                <li className={style.holder}
                    key={slide.id}
                    onClick={
                        () => {
                            console.log('Порядковый номер: ', index);
                            console.log('id: ', slide.id);
                            dispatch(setSelectedSlides, {slideIds: [slide.id]});
                        }
                    }>
                    <p className={style.holder__num}>
                        {index + 1}
                    </p>
                    <Slide
                        slide={slide}
                        slideSize={pres.size}
                        isEditable={false}
                        isActive={pres.selection.selectedSlideIds.includes(slide.id)}
                        activeElements={pres.selection.selectedSlideIds}
                    />
                </li>
            )}
        </ul>
    );
}