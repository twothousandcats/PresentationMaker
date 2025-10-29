import type {Slide} from "../types/types.ts";
import {useCallback} from "react";
import {dispatch} from "../editor.ts";
import {setSelectedSlides} from "../functions/functions.ts";
import * as React from "react";


interface SelectSlides {
    slides: Slide[];
    selectedSlideIds: string[];
}

export const useSelectSlides = (
    {
        slides,
        selectedSlideIds,
    }: SelectSlides
) => {
    const handleSelectSlide = useCallback(
        (
            event: React.MouseEvent,
            curSlide: Slide
        ) => {
            if (event.ctrlKey || event.metaKey) {
                const isSelected = selectedSlideIds.includes(curSlide.id);
                const newSelection = isSelected
                    ? selectedSlideIds.filter(id => id !== curSlide.id)
                    : [...selectedSlideIds, curSlide.id];

                dispatch(setSelectedSlides, {
                    slideIds: newSelection,
                });
            } else if (event.shiftKey && selectedSlideIds.length > 0) {
                const lastSelectedSlide = selectedSlideIds[selectedSlideIds.length - 1];
                const lastSelectedIndex = slides.findIndex(slide => slide.id === lastSelectedSlide);
                const currentIndex = slides.findIndex(slide => slide.id === curSlide.id);

                if (lastSelectedIndex !== -1 && currentIndex !== -1) {
                    // сортировка по возрастанию (slide -> start <= end)
                    const [start, end] = [lastSelectedIndex, currentIndex].sort((a, b) => a - b);
                    let rangeIds = slides.slice(start, end + 1).map(slide => slide.id);

                    if(lastSelectedIndex > currentIndex) {
                        rangeIds = rangeIds.reverse();
                    }

                    dispatch(setSelectedSlides, {
                        slideIds: rangeIds,
                    })
                }
            } else {
                dispatch(setSelectedSlides, {
                    slideIds: [curSlide.id],
                });
            }
        }, [slides, selectedSlideIds]);


    return {handleSelectSlide}
}