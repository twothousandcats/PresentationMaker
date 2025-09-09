function renamePresentation(newTitle, pres) {
    return Object.assign(Object.assign({}, pres), { title: newTitle });
}
function addSlide(newSlide, pres, position) {
    const slides = [...pres.slides];
    const insertAt = position !== null && position !== void 0 ? position : slides.length;
    slides.splice(insertAt, 0, newSlide);
    return Object.assign(Object.assign({}, pres), { slides });
}
function deleteSlides(slideIds, pres) {
    var _a, _b, _c, _d;
    const slides = pres.slides.filter(slide => {
        !slideIds.includes(slide.id);
    });
    const selectedSlideId = (_b = (_a = slides.find(slide => slide.id === pres.selectedSlideId)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ((_d = (_c = slides[0]) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : null);
    return Object.assign(Object.assign({}, pres), { slides,
        selectedSlideId });
}
// Пока для одного слайда
function moveSlide(fromIndex, toIndex, pres) {
    const slides = [...pres.slides];
    const [moved] = slides.splice(fromIndex, 1);
    slides.splice(toIndex, 0, moved);
    return Object.assign(Object.assign({}, pres), { slides });
}
function addTextElement(slide, newElement) {
    return Object.assign(Object.assign({}, slide), { elements: [
            ...slide.elements,
            newElement
        ] });
}
function addImageElement(slide, newElement) {
    return Object.assign(Object.assign({}, slide), { elements: [
            ...slide.elements,
            newElement
        ] });
}
function deleteElements(slide, elementIds) {
    return Object.assign(Object.assign({}, slide), { elements: slide.elements.filter(el => !elementIds.includes(el.id)) });
}
function changeElementPosition(slide, elementId, position) {
    return Object.assign(Object.assign({}, slide), { elements: slide.elements.map(el => el.id === elementId
            ? Object.assign(Object.assign({}, el), { position }) : el) });
}
function changeElementSize(slide, elementId, size) {
    return Object.assign(Object.assign({}, slide), { elements: slide.elements.map(el => el.id === elementId
            ? Object.assign(Object.assign({}, el), { size }) : el) });
}
function changeText(slide, elementId, newText) {
    return Object.assign(Object.assign({}, slide), { elements: slide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? Object.assign(Object.assign({}, el), { text: newText }) : el) });
}
function changeTextFontSize(slide, elementId, newFontSize) {
    return Object.assign(Object.assign({}, slide), { elements: slide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? Object.assign(Object.assign({}, el), { fontSize: newFontSize }) : el) });
}
function changeTextFontFamily(slide, elementId, fontFamily) {
    return Object.assign(Object.assign({}, slide), { elements: slide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? Object.assign(Object.assign({}, el), { fontFamily }) : el) });
}
function changeTextColor(slide, elementId, color) {
    return Object.assign(Object.assign({}, slide), { elements: slide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? Object.assign(Object.assign({}, el), { color }) : el) });
}
function changeSlideBackground(slide, background) {
    return Object.assign(Object.assign({}, slide), { background });
}
