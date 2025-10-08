import style from './SlidesList.module.css';
import type {
    Slide as SlideType,
    Size,
    Selection
} from "../../store/types/types.ts";
import Slide from "../Slide/Slide.tsx";
import {dispatch} from "../../store/editor.ts";
import {setSelectedSlides} from "../../store/functions/functions.ts";

interface SlidesListProps {
    slides: SlideType[];
    size: Size;
    selection: Selection;
}

export default function SlidesList(
    {
        slides,
        size,
        selection
    }: SlidesListProps
) {
    return (
        <ul className={style.container}>
            {slides.length > 0 && slides.map((slide, index) =>
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
                        slideSize={size}
                        isEditable={false}
                        isActive={selection.selectedSlideIds.includes(slide.id)}
                        activeElements={selection.selectedSlideIds}
                    />
                </li>
            )}
        </ul>
    );
}