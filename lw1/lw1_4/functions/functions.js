export function getCurSlideId(pres) {
    if (!pres.selectedSlideId.length) {
        return '';
    }
    return pres.selectedSlideId;
}
export function renamePresentation(newTitle, pres) {
    return Object.assign(Object.assign({}, pres), { title: newTitle });
}
export function addSlide(newSlide, pres, position) {
    const slides = [...pres.slides];
    const insertAt = position !== null && position !== void 0 ? position : slides.length;
    slides.splice(insertAt, 0, newSlide);
    return Object.assign(Object.assign({}, pres), { slides });
}
export function deleteSlides(slideIds, pres) {
    var _a, _b, _c, _d;
    const slides = pres.slides.filter(slide => {
        !slideIds.includes(slide.id);
    });
    const selectedSlideId = (_b = (_a = slides.find(slide => slide.id === pres.selectedSlideId)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ((_d = (_c = slides[0]) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : null);
    return Object.assign(Object.assign({}, pres), { slides,
        selectedSlideId });
}
// Пока для одного слайда
export function moveSlide(fromIndex, toIndex, pres) {
    const slides = [...pres.slides];
    const [moved] = slides.splice(fromIndex, 1);
    slides.splice(toIndex, 0, moved);
    return Object.assign(Object.assign({}, pres), { slides });
}
export function addTextElement(pres, newElement) {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return Object.assign({}, pres);
    }
    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = Object.assign(Object.assign({}, selectedSlide), { elements: [
            ...selectedSlide.elements,
            newElement
        ] });
    return Object.assign(Object.assign({}, pres), { slides });
}
export function addImageElement(pres, newElement) {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return Object.assign({}, pres);
    }
    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = Object.assign(Object.assign({}, selectedSlide), { elements: [
            ...selectedSlide.elements,
            newElement
        ] });
    return Object.assign(Object.assign({}, pres), { slides });
}
export function deleteElements(pres, elementIds) {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return Object.assign({}, pres);
    }
    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = Object.assign(Object.assign({}, selectedSlide), { elements: selectedSlide.elements.filter(el => !elementIds.includes(el.id)) });
    return Object.assign(Object.assign({}, pres), { slides });
}
export function changeElementPosition(pres, elementId, position) {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return Object.assign({}, pres);
    }
    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = Object.assign(Object.assign({}, selectedSlide), { elements: selectedSlide.elements.map(el => el.id === elementId
            ? Object.assign(Object.assign({}, el), { position }) : el) });
    return Object.assign(Object.assign({}, pres), { slides });
}
export function changeElementSize(pres, elementId, size) {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return Object.assign({}, pres);
    }
    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = Object.assign(Object.assign({}, selectedSlide), { elements: selectedSlide.elements.map(el => el.id === elementId
            ? Object.assign(Object.assign({}, el), { size }) : el) });
    return Object.assign(Object.assign({}, pres), { slides });
}
export function changeText(pres, elementId, newText) {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return Object.assign({}, pres);
    }
    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = Object.assign(Object.assign({}, selectedSlide), { elements: selectedSlide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? Object.assign(Object.assign({}, el), { text: newText }) : el) });
    return Object.assign(Object.assign({}, pres), { slides });
}
export function changeTextFontSize(pres, elementId, newFontSize) {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return Object.assign({}, pres);
    }
    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = Object.assign(Object.assign({}, selectedSlide), { elements: selectedSlide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? Object.assign(Object.assign({}, el), { fontSize: newFontSize }) : el) });
    return Object.assign(Object.assign({}, pres), { slides });
}
export function changeTextFontFamily(pres, elementId, fontFamily) {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return Object.assign({}, pres);
    }
    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = Object.assign(Object.assign({}, selectedSlide), { elements: selectedSlide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? Object.assign(Object.assign({}, el), { fontFamily }) : el) });
    return Object.assign(Object.assign({}, pres), { slides });
}
export function changeTextColor(pres, elementId, color) {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return Object.assign({}, pres);
    }
    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = Object.assign(Object.assign({}, selectedSlide), { elements: selectedSlide.elements.map(el => el.id === elementId && el.kind === 'text'
            ? Object.assign(Object.assign({}, el), { color }) : el) });
    return Object.assign(Object.assign({}, pres), { slides });
}
export function changeSlideBackground(pres, background) {
    const selectedId = getCurSlideId(pres);
    if (!selectedId.length) {
        return Object.assign({}, pres);
    }
    const slides = [...pres.slides];
    const selectedSlide = slides[selectedId];
    slides[selectedId] = Object.assign(Object.assign({}, selectedSlide), { background });
    return Object.assign(Object.assign({}, pres), { slides });
}
