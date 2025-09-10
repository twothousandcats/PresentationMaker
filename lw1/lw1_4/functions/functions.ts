import {ImageElement, Position, Presentation, Size, Slide, SlideBackground, TextElement} from "../types/types";

export function getCurSlideId(pres: Presentation): string {
    if (!pres.selectedSlideId.length) {
        return '';
    }

    return pres.selectedSlideId;
}

export function renamePresentation(newTitle: string, pres: Presentation): Presentation {
    return {
        ...pres,
        title: newTitle
    };
}

export function addSlide(newSlide: Slide, pres: Presentation, position?: number): Presentation {
    const slides = [...pres.slides];
    const insertAt = position ?? slides.length;
    slides.splice(insertAt, 0, newSlide);

    return {
        ...pres,
        slides
    };
}

export function deleteSlides(slideIds: string[], pres: Presentation): Presentation {
    const slides = pres.slides.filter(slide => {
        !slideIds.includes(slide.id);
    });
    const selectedSlideId = slides.find(
        slide => slide.id === pres.selectedSlideId
    )?.id ?? (slides[0]?.id ?? null);

    return {
        ...pres,
        slides,
        selectedSlideId
    };
}

// Пока для одного слайда
export function moveSlide(fromIndex: number, toIndex: number, pres: Presentation): Presentation {
    const slides = [...pres.slides];
    const [moved] = slides.splice(fromIndex, 1);
    slides.splice(toIndex, 0, moved);

    return {
        ...pres,
        slides
    };
}

export function addTextElement(pres: Presentation, newElement: TextElement): Presentation {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return {
            ...pres
        }
    }

    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = {
        ...selectedSlide,
        elements: [
            ...selectedSlide.elements,
            newElement
        ]
    }

    return {
        ...pres,
        slides
    };
}

export function addImageElement(pres: Presentation, newElement: ImageElement): Presentation {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return {
            ...pres
        }
    }

    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = {
        ...selectedSlide,
        elements: [
            ...selectedSlide.elements,
            newElement
        ]
    }

    return {
        ...pres,
        slides
    };
}

export function deleteElements(pres: Presentation, elementIds: string[]): Presentation {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return {
            ...pres
        }
    }

    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = {
        ...selectedSlide,
        elements: selectedSlide.elements.filter(el => !elementIds.includes(el.id))
    }

    return {
        ...pres,
        slides
    }
}

export function changeElementPosition(pres: Presentation, elementId: string, position: Position): Presentation {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return {
            ...pres
        }
    }

    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = {
        ...selectedSlide,
        elements: selectedSlide.elements.map(el => el.id === elementId
            ? {...el, position}
            : el
        )
    }

    return {
        ...pres,
        slides
    };
}

export function changeElementSize(pres: Presentation, elementId: string, size: Size): Presentation {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return {
            ...pres
        }
    }

    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = {
        ...selectedSlide,
        elements: selectedSlide.elements.map(el => el.id === elementId
            ? {...el, size}
            : el
        )
    }

    return {
        ...pres,
        slides
    };
}

export function changeText(pres: Presentation, elementId: string, newText: string): Presentation {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return {
            ...pres
        }
    }

    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = {
        ...selectedSlide,
        elements: selectedSlide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? {...el, text: newText}
            : el
        )
    }

    return {
        ...pres,
        slides
    };
}

export function changeTextFontSize(pres: Presentation, elementId: string, newFontSize: number): Presentation {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return {
            ...pres
        }
    }

    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = {
        ...selectedSlide,
        elements: selectedSlide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? {...el, fontSize: newFontSize}
            : el
        )
    }

    return {
        ...pres,
        slides
    };
}

export function changeTextFontFamily(pres: Presentation, elementId: string, fontFamily: string): Presentation {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return {
            ...pres
        }
    }

    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = {
        ...selectedSlide,
        elements: selectedSlide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? {...el, fontFamily}
            : el
        )
    }

    return {
        ...pres,
        slides
    };
}

export function changeTextColor(pres: Presentation, elementId: string, color: string): Presentation {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return {
            ...pres
        }
    }

    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = {
        ...selectedSlide,
        elements: selectedSlide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? {...el, color}
            : el
        )
    }

    return {
        ...pres,
        slides
    };
}

export function changeSlideBackground(pres: Presentation, background: SlideBackground): Presentation {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return {
            ...pres
        }
    }

    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = {
        ...selectedSlide,
        background
    }

    return {
        ...pres,
        slides
    };
}