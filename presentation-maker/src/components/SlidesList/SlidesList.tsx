import style from './SlidesList.module.css';
import type {
    Slide as SlideType,
    Size,
    Selection
} from "../../store/types/types.ts";
import Slide from "../Slide/Slide.tsx";
import {dispatch} from "../../store/editor.ts";
import {setSelectedSlides} from "../../store/functions/functions.ts";
import * as React from "react";

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
    // TODO: перенести в кастомный useSelect
    const handleSelectSlide = (
        evt: React.MouseEvent,
        slide: SlideType
    ) => {
        const {selectedSlideIds} = selection;

        // ctrl || cmd
        if (evt.ctrlKey || evt.metaKey) {
            const isSelected = selectedSlideIds.includes(slide.id);
            const newSelection = isSelected
                ? selectedSlideIds.filter(id => id !== slide.id)
                : [...selectedSlideIds, slide.id];

            dispatch(setSelectedSlides, {
                slideIds: newSelection
            });
        } else if (evt.shiftKey && selectedSlideIds.length > 0) {
            const lastSelectedId = selectedSlideIds[selectedSlideIds.length - 1];
            const lastSelectedIndex = slides.findIndex(slide =>
                slide.id === lastSelectedId
            );
            const currentIndex = slides.findIndex(s =>
                s.id === slide.id
            );

            if (lastSelectedIndex !== -1 && currentIndex !== -1) {
                const [start, end] = [lastSelectedIndex, currentIndex].sort((a, b) => a - b);
                const rangeIds = slides.slice(start, end + 1).map(s => s.id);
                dispatch(setSelectedSlides, {slideIds: rangeIds});
            }
        } else {
            dispatch(setSelectedSlides, {
                slideIds: [slide.id]
            });
        }
    };

    return (
        <ul className={style.container}>
            {slides.length > 0 && slides.map((slide, index) =>
                <li className={style.holder}
                    key={slide.id}
                    onClick={
                        (evt) => handleSelectSlide(evt, slide)
                    }>
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