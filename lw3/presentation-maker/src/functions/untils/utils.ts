import {
    Presentation,
    Slide,
    SlideElement
} from "../../types/types";

export function updateSlide(updatedSlide: Slide, pres: Presentation): Presentation {
    return {
        ...pres,
        slides: pres.slides.map(
            slide => slide.id === updatedSlide.id
                ? updatedSlide
                : slide
        )
    }
}

export function updateElementInSlide(
    slideId: string,
    elementId: string,
    updater: (element: SlideElement) => SlideElement,
    pres: Presentation
): Presentation {
    const targetSlide = pres.slides.find(slide => slide.id === slideId);
    if (!targetSlide) {
        return pres;
    }

    const updatedSlide: Slide = {
        ...targetSlide,
        elements: targetSlide.elements.map(
            element => element.id === elementId
                // без тайп гарда ide ругается {}[] из-за map
                ? updater(element)
                : element
        )
    };

    return updateSlide(updatedSlide, pres);
}