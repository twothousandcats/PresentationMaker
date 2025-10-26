import style from './SlidesList.module.css';
import type {
    Slide as SlideType,
    Size,
    Selection
} from "../../store/types/types.ts";
import Slide from "../Slide/Slide.tsx";
import {useSelectSlides} from "../../store/hooks/useSelectSlides.ts";
import {useSlidesDND} from "../../store/hooks/useSlidesDND.ts";

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
    const {handleSelectSlide} = useSelectSlides({slides, selectedSlideIds: selection.selectedSlideIds});
    const {handleMouseDown} = useSlidesDND({slides, selectedSlideIds: selection.selectedSlideIds,});

    return (
        <ul className={style.container}>
            {slides.length > 0 && slides.map((slide, index) =>
                <li
                    key={slide.id}
                    className={style.holder}
                    data-slide-id={slide.id}
                    onClick={
                        (event) => handleSelectSlide(event, slide)
                    }
                onMouseDown={(event) => handleMouseDown(event, slide.id)}
                >
                    <p className={style.holder__num}>
                        {index + 1}
                    </p>
                    <Slide
                        slide={slide}
                        slideSize={size}
                        selection={selection}
                        isEditable={false}
                        isActive={selection.selectedSlideIds.includes(slide.id)}
                        activeElements={selection.selectedSlideIds}
                    />
                </li>
            )}
        </ul>
    );
}