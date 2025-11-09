import type {
  RectangleElement,
  Presentation,
  Slide,
  SlideElement,
  TextElement,
} from '../../types/types';

export function updateSlide(
  updatedSlide: Slide,
  pres: Presentation
): Presentation {
  return {
    ...pres,
    slides: pres.slides.map((slide) =>
      slide.id === updatedSlide.id ? updatedSlide : slide
    ),
  };
}

export function updateElementInSlide(
  slideId: string,
  elementId: string,
  updater: (element: SlideElement) => SlideElement,
  pres: Presentation
): Presentation {
  const targetSlide = pres.slides.find((slide) => slide.id === slideId);
  if (!targetSlide) {
    return pres;
  }

  const updatedSlide: Slide = {
    ...targetSlide,
    elements: targetSlide.elements.map((element) =>
      element.id === elementId
        ? // без тайп гарда ide ругается {}[] из-за map
          updater(element)
        : element
    ),
  };

  console.log(updatedSlide.elements);

  return updateSlide(updatedSlide, pres);
}

export function getRandomId() {
  return crypto.randomUUID();
}

export function clearSelection(pres: Presentation): Presentation {
  if (pres.selection.selectedElementIds.length > 0) {
    return {
      ...pres,
      selection: {
        ...pres.selection,
        selectedElementIds: [],
      },
    };
  } else if (
    pres.selection.selectedElementIds.length === 0 &&
    pres.selection.selectedSlideIds.length > 0
  ) {
    return {
      ...pres,
      selection: {
        ...pres.selection,
        selectedSlideIds: [],
      },
    };
  } else {
    return pres;
  }
}

export function concatModifiersByFlag(classNames: string[]) {
  let modifiers = '';
  classNames.forEach((className) => {
    modifiers += ' ' + className;
  });
  return modifiers;
}

export function getPercentValue(v1: number, v2: number): number {
  return (v1 / v2) * 100;
}

export function createDefaultSlide(): Slide {
  return {
    id: getRandomId(),
    background: {
      type: 'solid',
      color: '#fff',
    },
    elements: [],
  };
}

export function createTextEl(): TextElement {
  return {
    id: getRandomId(),
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 50,
      height: 50,
    },
    background: null,
    type: 'text',
    content: '',
    fontFamily: 'Arial',
    fontSize: 14,
    fontWeight: 400,
    color: '#000',
  };
}

export function createRectangleEl(): RectangleElement {
  return {
    id: getRandomId(),
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 200,
      height: 200,
    },
    background: null,
    type: 'rectangle',
  };
}
