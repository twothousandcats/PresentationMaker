import {Presentation, Slide} from "../types/types";

function addSlide(newSlide: Slide, pres: Presentation, position?: number): Presentation {
    const slides = [...pres.slides];
    const insertAt = position ?? slides.length;
    slides.splice(insertAt, 0, newSlide);

    return { ...pres, slides };
}

function renamePresentation(newTitle: string, pres: Presentation): Presentation {
    return { ...pres,
        title: newTitle
    };
}