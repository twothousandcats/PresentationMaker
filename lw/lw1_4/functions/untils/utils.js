export function updateSlide(updatedSlide, pres) {
    return Object.assign(Object.assign({}, pres), { slides: pres.slides.map(slide => slide.id === updatedSlide.id
            ? updatedSlide
            : slide) });
}
export function updateElementInSlide(slideId, elementId, updater, pres) {
    const targetSlide = pres.slides.find(slide => slide.id === slideId);
    if (!targetSlide) {
        return pres;
    }
    const updatedSlide = Object.assign(Object.assign({}, targetSlide), { elements: targetSlide.elements.map(element => element.id === elementId
            // без тайп гарда ide ругается {}[] из-за map
            ? updater(element)
            : element) });
    return updateSlide(updatedSlide, pres);
}
