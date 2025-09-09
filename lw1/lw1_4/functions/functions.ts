import {
    ImageElement,
    Position,
    Presentation,
    Size,
    Slide,
    SlideBackground,
    TextElement
} from "../types/types";

function renamePresentation(newTitle: string, pres: Presentation): Presentation {
    return {
        ...pres,
        title: newTitle
    };
}

function addSlide(newSlide: Slide, pres: Presentation, position?: number): Presentation {
    const slides = [...pres.slides];
    const insertAt = position ?? slides.length;
    slides.splice(insertAt, 0, newSlide);

    return {
        ...pres,
        slides
    };
}

function deleteSlides(slideIds: string[], pres: Presentation): Presentation {
    const slides = pres.slides.filter(slide => {
        !slideIds.includes(slide.id);
    });
    const selectedSlideId = slides.find(slide => slide.id === pres.selectedSlideId)?.id ?? (slides[0]?.id ?? null);

    return {
        ...pres,
        slides,
        selectedSlideId
    };
}

// Пока для одного слайда
function moveSlide(fromIndex: number, toIndex: number, pres: Presentation): Presentation {
    const slides = [...pres.slides];
    const [moved] = slides.splice(fromIndex, 1);
    slides.splice(toIndex, 0, moved);

    return {
        ...pres,
        slides
    };
}

function addTextElement(slide: Slide, newElement: TextElement): Slide {
    return {
        ...slide,
        elements: [
            ...slide.elements,
            newElement
        ]
    };
}

function addImageElement(slide: Slide, newElement: ImageElement): Slide {
    return {
        ...slide,
        elements: [
            ...slide.elements,
            newElement
        ]
    };
}

function deleteElements(slide: Slide, elementIds: string[]): Slide {
    return {
        ...slide,
        elements: slide.elements.filter(el => !elementIds.includes(el.id))
    };
}

function changeElementPosition(slide: Slide, elementId: string, position: Position): Slide {
    return {
        ...slide,
        elements: slide.elements.map(el => el.id === elementId
            ? {...el, position}
            : el
        )
    };
}

function changeElementSize(slide: Slide, elementId: string, size: Size): Slide {
    return {
        ...slide,
        elements: slide.elements.map(el => el.id === elementId
            ? {...el, size}
            : el
        )
    };
}

function changeText(slide: Slide, elementId: string, newText: string): Slide {
    return {
        ...slide,
        elements: slide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? {...el, text: newText}
            : el
        )
    };
}

function changeTextFontSize(slide: Slide, elementId: string, newFontSize: number): Slide {
    return {
        ...slide,
        elements: slide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? {...el, fontSize: newFontSize}
            : el
        )
    };
}

function changeTextFontFamily(slide: Slide, elementId: string, fontFamily: string): Slide {
    return {
        ...slide,
        elements: slide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? {...el, fontFamily}
            : el
        )
    };
}

function changeTextColor(slide: Slide, elementId: string, color: string): Slide {
    return {
        ...slide,
        elements: slide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? {...el, color}
            : el
        )
    };
}

function changeSlideBackground(slide: Slide, background: SlideBackground): Slide {
    return {
        ...slide,
        background
    };
}