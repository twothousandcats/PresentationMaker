import type {
    Position,
    Size,
    Background,
    SlideElement,
    Slide,
    Presentation,
} from "../types/types";
import {
    updateElementInSlide,
    updateSlide
} from "./untils/utils";

export function renamePresentation(
    pres: Presentation,
    payload: { newName: string }
): Presentation {
    const {newName} = payload;
    return {
        ...pres,
        title: newName
    }
}

export function addSlide(
    pres: Presentation,
    payload: { newSlide: Slide }
): Presentation {
    const {newSlide} = payload;
    return {
        ...pres,
        slides: [
            ...pres.slides,
            newSlide
        ]
    }
}

export function removeSlide(
    pres: Presentation,
    payload: { slideIdsToRemove: string[] }
): Presentation {
    const {slideIdsToRemove} = payload;
    const newSlides = pres.slides.filter(slide => !slideIdsToRemove.includes(slide.id));
    const newSelectedSlideIds = pres.selection.selectedSlideIds.filter(
        id => !slideIdsToRemove.includes(id)
    );
    const newSelection = !newSelectedSlideIds.length && newSlides.length > 0
        ? {
            ...pres.selection,
            selectedSlideIds: [newSlides[0].id]
        }
        : {
            ...pres.selection,
            selectedSlideIds: newSelectedSlideIds
        };

    return {
        ...pres,
        slides: newSlides,
        selection: newSelection
    }
}

export function moveSlides(
    pres: Presentation,
    payload: {
        slideIds: string[];
        newIndex: number;
    }
): Presentation {
    const { slideIds, newIndex } = payload;

    // Убираем дубликаты и сохраняем порядок
    const uniqueSlideIds = Array.from(new Set(slideIds));

    const slides = [...pres.slides];

    // Находим текущие индексы перемещаемых слайдов
    const movedSlides: Slide[] = [];
    const remainingSlides: Slide[] = [];

    for (const slide of slides) {
        if (uniqueSlideIds.includes(slide.id)) {
            movedSlides.push(slide);
        } else {
            remainingSlides.push(slide);
        }
    }

    // Если ни один из слайдов не найден или newIndex не требует изменений
    if (movedSlides.length === 0) {
        return pres;
    }

    // Не выходим за 0 и максимальный индекс
    const clampedNewIndex = Math.max(0, Math.min(newIndex, remainingSlides.length));

    const newSlides = [
        ...remainingSlides.slice(0, clampedNewIndex),
        ...movedSlides,
        ...remainingSlides.slice(clampedNewIndex)
    ];

    return {
        ...pres,
        slides: newSlides
    };
}

export function addElementToSlide(
    pres: Presentation,
    payload: {
        slideId: string,
        newElement: SlideElement
    }
): Presentation {
    const {slideId, newElement} = payload;
    const targetSlide = pres.slides.find(slide => slide.id === slideId);
    if (!targetSlide) {
        return pres;
    }

    const updatedSlide: Slide = {
        ...targetSlide,
        elements: [
            ...targetSlide.elements,
            newElement
        ]
    }

    return updateSlide(updatedSlide, pres);
}

export function removeElementsFromSlide(
    pres: Presentation,
    payload: {
        slideId: string,
        elementIds: string[]
    }
): Presentation {
    const {slideId, elementIds} = payload;
    const targetSlide = pres.slides.find(slide => slide.id === slideId);
    if (!targetSlide) {
        return pres;
    }

    const updatedSlide: Slide = {
        ...targetSlide,
        elements: targetSlide.elements.filter(el => !elementIds.includes(el.id))
    }
    const newSelectedElementIds = pres.selection.selectedElementIds.filter(id => !elementIds.includes(id));
    const newSelection = {
        ...pres.selection,
        selectedElementIds: newSelectedElementIds
    }

    return {
        ...updateSlide(updatedSlide, pres),
        selection: newSelection
    }
}

export function changeElPosition(
    pres: Presentation,
    payload: {
        slideId: string,
        elementId: string,
        newPosition: Position
    }
): Presentation {
    const {slideId, elementId, newPosition} = payload;
    console.log(newPosition);
    return updateElementInSlide(
        slideId,
        elementId,
        (el) => ({...el, position: newPosition}) as SlideElement,
        pres
    );
}

export function changeElSize(
    pres: Presentation,
    payload: {
        slideId: string,
        elementId: string,
        newSize: Size
    }
): Presentation {
    const {slideId, elementId, newSize} = payload;
    return updateElementInSlide(
        slideId,
        elementId,
        (el) => ({...el, size: newSize}) as SlideElement,
        pres
    );
}

export function changeTextElContent(
    pres: Presentation,
    payload: {
        slideId: string,
        elementId: string,
        newContent: string
    }
): Presentation {
    const {slideId, elementId, newContent} = payload;
    return updateElementInSlide(
        slideId,
        elementId,
        (el) => ({...el, content: newContent}) as SlideElement,
        pres
    );
}

export function changeFontFamily(
    pres: Presentation,
    payload: {
        slideId: string,
        elementId: string,
        newFF: string
    }
): Presentation {
    const {slideId, elementId, newFF} = payload;
    return updateElementInSlide(
        slideId,
        elementId,
        (el) => ({...el, fontFamily: newFF}) as SlideElement,
        pres
    );
}

export function changeElementBg(
    pres: Presentation,
    payload: {
        slideId: string,
        elementId: string,
        newBg: Background
    }
): Presentation {
    const {slideId, elementId, newBg} = payload;
    return updateElementInSlide(
        slideId,
        elementId,
        (el) => ({...el, background: newBg}) as SlideElement,
        pres
    );
}

export function changeSlideBg(
    pres: Presentation,
    payload: {
        slideId: string,
        newBg: Background
    }
): Presentation {
    const {slideId, newBg} = payload;
    const targetSlide = pres.slides.find(slide => slide.id === slideId);
    if (!targetSlide) {
        return pres;
    }

    const updatedSlide: Slide = {
        ...targetSlide,
        background: newBg
    }

    return updateSlide(updatedSlide, pres);
}

export function setSelectedSlides(
    pres: Presentation,
    payload: {
        slideIds: string[]
    }
): Presentation {
    const {slideIds} = payload;
    console.log(slideIds);
    return {
        ...pres,
        selection: {
            ...pres.selection,
            selectedSlideIds: slideIds
        }
    };
}

export function setSelectedElements(
    pres: Presentation,
    payload: {
        elementsIds: string[]
    }): Presentation {
    const {elementsIds} = payload;
    return {
        ...pres,
        selection: {
            ...pres.selection,
            selectedElementIds: elementsIds
        }
    };
}