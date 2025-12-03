import type {
  Position,
  Size,
  Background,
  SlideElement,
  Slide,
  HistoryEntry,
  Presentation,
} from '../types/types';

function updateSlide(updatedSlide: Slide, pres: Presentation): Presentation {
  return {
    ...pres,
    slides: pres.slides.map((slide) =>
      slide.id === updatedSlide.id ? updatedSlide : slide
    ),
  };
}

function updateElementInSlide(
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

  return updateSlide(updatedSlide, pres);
}

export function renamePresentation(
  pres: Presentation,
  payload: { newName: string }
): HistoryEntry {
  const updatedPres = { ...pres, title: payload.newName };

  return {
    presentation: updatedPres,
    context: {
      affectedSlideIds: [],
      affectedElementIds: [],
      scrollTargetSlideId: undefined,
    },
  };
}

export function addSlide(
  pres: Presentation,
  payload: { newSlide: Slide }
): HistoryEntry {
  const updatedPresentation = {
    ...pres,
    slides: [...pres.slides, payload.newSlide],
  };

  return {
    presentation: updatedPresentation,
    context: {
      affectedSlideIds: [payload.newSlide.id],
      affectedElementIds: [],
      scrollTargetSlideId: payload.newSlide.id,
    },
  };
}

export function removeSlide(
  pres: Presentation,
  payload: { slideIdsToRemove: string[] }
): HistoryEntry {
  const { slideIdsToRemove } = payload;
  // обновленные, без удаляемого
  const newSlides = pres.slides.filter(
    (slide) => !slideIdsToRemove.includes(slide.id)
  );
  // index удаляемого в исходном состоянии
  const firstRemovedIndex = pres.slides.findIndex(s => slideIdsToRemove.includes(s.id));
  let nextSlideId: string | undefined;

  if (firstRemovedIndex !== -1) {
    if (firstRemovedIndex < newSlides.length) {
      nextSlideId = newSlides[firstRemovedIndex].id; // следующий
    } else if (firstRemovedIndex > 0) {
      nextSlideId = newSlides[firstRemovedIndex - 1].id; // предыдущий
    }
    // undefined если нет слайдов -> selection пустой
  }

  const scrollTargetSlideId = nextSlideId || (newSlides.length > 0 ? newSlides[0].id : undefined);

  const updatedPresentation: Presentation = {
    ...pres,
    slides: newSlides,
  };

  return {
    presentation: updatedPresentation,
    context: {
      affectedSlideIds: slideIdsToRemove,
      affectedElementIds: [],
      scrollTargetSlideId,
    },
  };
}

export function moveSlides(
  pres: Presentation,
  payload: {
    slideIds: string[];
    newIndex: number;
  }
): HistoryEntry {
  const { slideIds, newIndex } = payload;

  // Убираем дубликаты и сохраняем порядок
  const uniqueSlideIds = Array.from(new Set(slideIds));

  // Находим текущие индексы перемещаемых слайдов
  const movedSlides: Slide[] = [];
  const remainingSlides: Slide[] = [];

  for (const slide of pres.slides) {
    if (uniqueSlideIds.includes(slide.id)) {
      movedSlides.push(slide);
    } else {
      remainingSlides.push(slide);
    }
  }

  // Если ни один из слайдов не найден или newIndex не требует изменений
  if (movedSlides.length === 0) {
    return {
      presentation: pres,
      context: {
        affectedSlideIds: [],
        affectedElementIds: [],
        scrollTargetSlideId: undefined,
      },
    };
  }

  // Не выходим за 0 и максимальный индекс
  const clampedNewIndex = Math.max(
    0,
    Math.min(newIndex, remainingSlides.length)
  );

  const newSlides = [
    ...remainingSlides.slice(0, clampedNewIndex),
    ...movedSlides,
    ...remainingSlides.slice(clampedNewIndex),
  ];

  const updatedPresentation = {
    ...pres,
    slides: newSlides,
  };

  return {
    presentation: updatedPresentation,
    context: {
      affectedSlideIds: uniqueSlideIds,
      affectedElementIds: [],
      scrollTargetSlideId: uniqueSlideIds[0],
    },
  };
}

export function addElementToSlide(
  pres: Presentation,
  payload: {
    slideId: string;
    newElement: SlideElement;
  }
): HistoryEntry {
  const { slideId, newElement } = payload;
  const slideIndex = pres.slides.findIndex((s) => s.id === slideId);
  if (slideIndex === -1) {
    return {
      presentation: pres,
      context: {
        affectedSlideIds: [],
        affectedElementIds: [],
        scrollTargetSlideId: undefined,
      },
    };
  }

  const updatedSlides = [...pres.slides];
  updatedSlides[slideIndex] = {
    ...updatedSlides[slideIndex],
    elements: [...updatedSlides[slideIndex].elements, newElement],
  };

  const updatedPresentation: Presentation = {
    ...pres,
    slides: updatedSlides,
  };

  return {
    presentation: updatedPresentation,
    context: {
      affectedSlideIds: [slideId],
      affectedElementIds: [newElement.id],
      scrollTargetSlideId: slideId,
    },
  };
}

export function removeElementsFromSlide(
  pres: Presentation,
  payload: {
    slideId: string;
    elementIds: string[];
  }
): HistoryEntry {
  const { slideId, elementIds } = payload;
  const slideIndex = pres.slides.findIndex((s) => s.id === slideId);
  if (slideIndex === -1) {
    return {
      presentation: pres,
      context: {
        affectedSlideIds: [],
        affectedElementIds: [],
        scrollTargetSlideId: undefined,
      },
    };
  }

  const updatedSlides = [...pres.slides];
  updatedSlides[slideIndex] = {
    ...updatedSlides[slideIndex],
    elements: updatedSlides[slideIndex].elements.filter(
      (el) => !elementIds.includes(el.id)
    ),
  };

  const updatedPresentation: Presentation = {
    ...pres,
    slides: updatedSlides,
  };

  return {
    presentation: updatedPresentation,
    context: {
      affectedSlideIds: [slideId],
      affectedElementIds: elementIds,
      scrollTargetSlideId: slideId,
    },
  };
}

export function changeElPosition(
  pres: Presentation,
  payload: {
    slideId: string;
    elementId: string;
    newPosition: Position;
  }
): HistoryEntry {
  const { slideId, elementId, newPosition } = payload;
  const updatedPresentation = updateElementInSlide(
    slideId,
    elementId,
    (el) => ({ ...el, position: newPosition }) as SlideElement,
    pres
  );

  return {
    presentation: updatedPresentation,
    context: {
      affectedSlideIds: [slideId],
      affectedElementIds: [elementId],
      scrollTargetSlideId: slideId,
    },
  };
}

export function changeElSize(
  pres: Presentation,
  payload: {
    slideId: string;
    elementId: string;
    newSize: Size;
  }
): HistoryEntry {
  const { slideId, elementId, newSize } = payload;
  const updatedPresentation = updateElementInSlide(
    slideId,
    elementId,
    (el) => ({ ...el, size: newSize }) as SlideElement,
    pres
  );

  return {
    presentation: updatedPresentation,
    context: {
      affectedSlideIds: [slideId],
      affectedElementIds: [elementId],
      scrollTargetSlideId: slideId,
    },
  };
}

export function changeTextElContent(
  pres: Presentation,
  payload: {
    slideId: string;
    elementId: string;
    newContent: string;
  }
): HistoryEntry {
  const { slideId, elementId, newContent } = payload;
  const updatedPresentation = updateElementInSlide(
    slideId,
    elementId,
    (el) => ({ ...el, content: newContent }) as SlideElement,
    pres
  );

  return {
    presentation: updatedPresentation,
    context: {
      affectedSlideIds: [slideId],
      affectedElementIds: [elementId],
      scrollTargetSlideId: slideId,
    },
  };
}

export function changeFontFamily(
  pres: Presentation,
  payload: {
    slideId: string;
    elementId: string;
    newFF: string;
  }
): HistoryEntry {
  const { slideId, elementId, newFF } = payload;
  const updatedPresentation = updateElementInSlide(
    slideId,
    elementId,
    (el) => ({ ...el, fontFamily: newFF }) as SlideElement,
    pres
  );

  return {
    presentation: updatedPresentation,
    context: {
      affectedSlideIds: [slideId],
      affectedElementIds: [elementId],
      scrollTargetSlideId: slideId,
    },
  };
}

export function changeElementBg(
  pres: Presentation,
  payload: {
    slideId: string;
    elementId: string;
    newBg: Background;
  }
): HistoryEntry {
  const { slideId, elementId, newBg } = payload;
  const updatedPresentation = updateElementInSlide(
    slideId,
    elementId,
    (el) => ({ ...el, background: newBg }) as SlideElement,
    pres
  );

  return {
    presentation: updatedPresentation,
    context: {
      affectedSlideIds: [slideId],
      affectedElementIds: [elementId],
      scrollTargetSlideId: slideId,
    },
  };
}

export function changeSlideBg(
  pres: Presentation,
  payload: {
    slideId: string;
    newBg: Background;
  }
): HistoryEntry {
  const { slideId, newBg } = payload;
  const slideIndex = pres.slides.findIndex((s) => s.id === slideId);
  if (slideIndex === -1) {
    return {
      presentation: pres,
      context: {
        affectedSlideIds: [],
        affectedElementIds: [],
        scrollTargetSlideId: undefined,
      },
    };
  }

  const updatedSlides = [...pres.slides];
  updatedSlides[slideIndex] = {
    ...updatedSlides[slideIndex],
    background: newBg,
  };

  const updatedPresentation: Presentation = {
    ...pres,
    slides: updatedSlides,
  };

  return {
    presentation: updatedPresentation,
    context: {
      affectedSlideIds: [slideId],
      affectedElementIds: [],
      scrollTargetSlideId: slideId,
    },
  };
}

export function resizeElement(
  pres: Presentation,
  payload: {
    slideId: string;
    elementId: string;
    newSize: Size;
    newPosition: Position;
  }
): HistoryEntry {
  const { slideId, elementId, newSize, newPosition } = payload;

  // размер
  let updatedPres = updateElementInSlide(
    slideId,
    elementId,
    (el) => ({ ...el, size: newSize }) as SlideElement,
    pres
  );

  // позиция
  updatedPres = updateElementInSlide(
    slideId,
    elementId,
    (el) => ({ ...el, position: newPosition }) as SlideElement,
    updatedPres
  );

  return {
    presentation: updatedPres,
    context: {
      affectedSlideIds: [slideId],
      affectedElementIds: [elementId],
      scrollTargetSlideId: slideId,
    },
  };
}
