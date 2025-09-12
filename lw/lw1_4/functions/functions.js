import { updateElementInSlide, updateSlide } from "./untils/utils";
export function renamePresentation(newName, pres) {
    return Object.assign(Object.assign({}, pres), { title: newName });
}
export function addSlide(newSlide, pres) {
    return Object.assign(Object.assign({}, pres), { slides: [
            ...pres.slides,
            newSlide
        ] });
}
export function removeSlide(slideIdsToRemove, pres) {
    const newSlides = pres.slides.filter(slide => !slideIdsToRemove.includes(slide.id));
    const newSelectedSlideIds = pres.selection.selectedSlideIds.filter(id => !slideIdsToRemove.includes(id));
    let newSelection = pres.selection;
    if (!newSelectedSlideIds.length && newSlides.length > 0) {
        newSelection = Object.assign(Object.assign({}, pres.selection), { selectedSlideIds: [newSlides[0].id] });
    }
    else {
        newSelection = Object.assign(Object.assign({}, pres.selection), { selectedSlideIds: newSelectedSlideIds });
    }
    return Object.assign(Object.assign({}, pres), { slides: newSlides, selection: newSelection });
}
export function moveSlide(slideId, newIndex, pres) {
    const slides = [...pres.slides];
    const curIndex = slides.findIndex(slide => slide.id === slideId);
    if (curIndex === -1 || curIndex === newIndex) {
        return pres;
    }
    const movedSlide = slides.find(slide => slide.id === slideId);
    const filteredSlides = slides.filter(slide => slide.id !== slideId);
    const newSlides = [
        ...filteredSlides.slice(0, newIndex),
        movedSlide,
        ...filteredSlides.slice(newIndex)
    ];
    return Object.assign(Object.assign({}, pres), { slides: newSlides });
}
export function addElementToSlide(slideId, newElement, pres) {
    const targetSlide = pres.slides.find(slide => slide.id === slideId);
    if (!targetSlide) {
        return pres;
    }
    const updatedSlide = Object.assign(Object.assign({}, targetSlide), { elements: [
            ...targetSlide.elements,
            newElement
        ] });
    return updateSlide(updatedSlide, pres);
}
export function removeElementsFromSlide(slideId, elementIds, pres) {
    const targetSlide = pres.slides.find(slide => slide.id === slideId);
    if (!targetSlide) {
        return pres;
    }
    const updatedSlide = Object.assign(Object.assign({}, targetSlide), { elements: targetSlide.elements.filter(el => !elementIds.includes(el.id)) });
    const newSelectedElementIds = pres.selection.selectedElementIds.filter(id => !elementIds.includes(id));
    const newSelection = Object.assign(Object.assign({}, pres.selection), { selectedElementIds: newSelectedElementIds });
    return Object.assign(Object.assign({}, updateSlide(updatedSlide, pres)), { selection: newSelection });
}
export function changeElPosition(slideId, elementId, newPosition, pres) {
    return updateElementInSlide(slideId, elementId, (el) => (Object.assign(Object.assign({}, el), { position: newPosition })), pres);
}
export function changeElSize(slideId, elementId, newSize, pres) {
    return updateElementInSlide(slideId, elementId, (el) => (Object.assign(Object.assign({}, el), { size: newSize })), pres);
}
export function changeTextElContent(slideId, elementId, newContent, pres) {
    return updateElementInSlide(slideId, elementId, (el) => (Object.assign(Object.assign({}, el), { content: newContent })), pres);
}
export function changeFontFamily(slideId, elementId, newFF, pres) {
    return updateElementInSlide(slideId, elementId, (el) => (Object.assign(Object.assign({}, el), { fontFamily: newFF })), pres);
}
export function changeSlideBg(slideId, newBg, pres) {
    const targetSlide = pres.slides.find(slide => slide.id === slideId);
    if (!targetSlide) {
        return pres;
    }
    const updatedSlide = Object.assign(Object.assign({}, targetSlide), { background: newBg });
    return updateSlide(updatedSlide, pres);
}
/* на будущее */
export function setSelectedSlides(slideIds, pres) {
    return Object.assign(Object.assign({}, pres), { selection: Object.assign(Object.assign({}, pres.selection), { selectedSlideIds: slideIds }) });
}
export function setSelectedElements(elementsIds, pres) {
    return Object.assign(Object.assign({}, pres), { selection: Object.assign(Object.assign({}, pres.selection), { selectedElementIds: elementsIds }) });
}
