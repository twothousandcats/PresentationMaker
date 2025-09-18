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

export function renamePresentation(newName: string, pres: Presentation): Presentation {
    return {
        ...pres,
        title: newName
    }
}

export function addSlide(newSlide: Slide, pres: Presentation): Presentation {
    return {
        ...pres,
        slides: [
            ...pres.slides,
            newSlide
        ]
    }
}

export function removeSlide(slideIdsToRemove: string[], pres: Presentation): Presentation {
    const newSlides = pres.slides.filter(slide => !slideIdsToRemove.includes(slide.id));
    const newSelectedSlideIds = pres.selection.selectedSlideIds.filter(
        id => !slideIdsToRemove.includes(id)
    );
    let newSelection = pres.selection;

    if (!newSelectedSlideIds.length && newSlides.length > 0) {
        newSelection = {
            ...pres.selection,
            selectedSlideIds: [newSlides[0].id]
        };
    } else {
        newSelection = {
            ...pres.selection,
            selectedSlideIds: newSelectedSlideIds
        };
    }

    return {
        ...pres,
        slides: newSlides,
        selection: newSelection
    }
}

export function moveSlide(slideId: string, newIndex: number, pres: Presentation): Presentation {
    const slides = [...pres.slides];
    const curIndex = slides.findIndex(slide => slide.id === slideId);
    if (curIndex === -1 || curIndex === newIndex) {
        return pres;
    }

    const movedSlide = slides.find(slide => slide.id === slideId)!;
    const filteredSlides = slides.filter(slide => slide.id !== slideId);
    const newSlides = [
        ...filteredSlides.slice(0, newIndex),
        movedSlide,
        ...filteredSlides.slice(newIndex)
    ];

    return {
        ...pres,
        slides: newSlides
    };
}

export function addElementToSlide(slideId: string, newElement: SlideElement, pres: Presentation): Presentation {
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

export function removeElementsFromSlide(slideId: string, elementIds: string[], pres: Presentation): Presentation {
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
    slideId: string,
    elementId: string,
    newPosition: Position,
    pres: Presentation
): Presentation {
    return updateElementInSlide(
        slideId,
        elementId,
        (el) => ({ ...el, position: newPosition }) as SlideElement,
        pres
    );
}

export function changeElSize(
    slideId: string,
    elementId: string,
    newSize: Size,
    pres: Presentation
): Presentation {
    return updateElementInSlide(
        slideId,
        elementId,
        (el) => ({...el, size: newSize}) as SlideElement,
        pres
    );
}

export function changeTextElContent(
    slideId: string,
    elementId: string,
    newContent: string,
    pres: Presentation
): Presentation {
    return updateElementInSlide(
        slideId,
        elementId,
        (el) => ({...el, content: newContent}) as SlideElement,
        pres
    );
}

export function changeFontFamily(
    slideId: string,
    elementId: string,
    newFF: string,
    pres: Presentation
): Presentation {
    return updateElementInSlide(
        slideId,
        elementId,
        (el) => ({...el, fontFamily: newFF}) as SlideElement,
        pres
    );
}

export function changeSlideBg(slideId: string, newBg: Background, pres: Presentation): Presentation {
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

/* на будущее */
export function setSelectedSlides(slideIds: string[], pres: Presentation): Presentation {
    return {
        ...pres,
        selection: {
            ...pres.selection,
            selectedSlideIds: slideIds
        }
    };
}

export function setSelectedElements(elementsIds: string[], pres: Presentation): Presentation {
    return {
        ...pres,
        selection: {
            ...pres.selection,
            selectedElementIds: elementsIds
        }
    };
}