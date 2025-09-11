import {
    Position,
    Size,
    RGBColor,
    HEXColor,
    Color,
    Gradient,
    ImageBackground,
    SolidColorBackground,
    GradientBackground,
    Background,
    ImageElement,
    TextElement,
    SlideElement,
    Slide,
    Selection,
    Presentation,
} from "../lw1_4/types/types";

import {
    renamePresentation,
    addSlide,
    removeSlide,
    moveSlide,
    addElementToSlide,
    removeElementsFromSlide,
    changeElPosition,
    changeElSize,
    changeTextElContent,
    changeFontFamily,
    changeSlideBg,
    setSelectedSlides,
    setSelectedElements,
} from "../lw1_4/functions/functions";

// Минимальные тестовые данные
const minimalPosition: Position = {
    x: "0",
    y: "0"
};

const minimalSize: Size = {
    width: "100",
    height: "100"
};

const minimalRGBColor: RGBColor = "rgb(0, 0, 0)";
const minimalHEXColor: HEXColor = "#000000";
const minimalColor: Color = minimalRGBColor;

const minimalGradient: Gradient = {
    angle: 0,
    colors: [minimalRGBColor, minimalHEXColor]
};

const minimalImageBackground: ImageBackground = {
    type: 'image',
    data: 'data:image/png;base64,minimal'
};

const minimalSolidColorBackground: SolidColorBackground = {
    type: 'solid',
    color: minimalRGBColor
};

const minimalGradientBackground: GradientBackground = {
    type: 'gradient',
    gradient: minimalGradient
};

const minimalBackground: Background = null;

const minimalImageElement: ImageElement = {
    id: "img1",
    type: 'image',
    position: minimalPosition,
    size: minimalSize,
    data: 'data:image/png;base64,minimal'
};

const minimalTextElement: TextElement = {
    id: "text1",
    type: 'text',
    position: minimalPosition,
    size: minimalSize,
    content: "Minimal text",
    fontFamily: "Arial",
    fontSize: 12,
    color: minimalRGBColor
};

const minimalSlide: Slide = {
    id: "slide1",
    background: minimalBackground,
    elements: []
};

const minimalSelection: Selection = {
    selectedSlideIds: [],
    selectedElementIds: []
};

const minimalPresentation: Presentation = {
    id: "pres1",
    title: "Minimal Presentation",
    slides: [],
    size: minimalSize,
    selection: minimalSelection
};

// Максимальные тестовые данные
const maxPosition1: Position = {
    x: "100",
    y: "200"
};

const maxPosition2: Position = {
    x: "300",
    y: "400"
};

const maxSize1: Size = {
    width: "500",
    height: "300"
};

const maxSize2: Size = {
    width: "800",
    height: "600"
};

const maxRGBColor: RGBColor = "rgb(255, 128, 64)";
const maxHEXColor: HEXColor = "#FF8040";
const maxColor1: Color = maxRGBColor;
const maxColor2: Color = maxHEXColor;

const maxGradient: Gradient = {
    angle: 45,
    colors: [maxRGBColor, maxHEXColor, "rgb(0, 255, 0)", "#00F"]
};

const maxImageBackground: ImageBackground = {
    type: 'image',
    data: 'data:image/jpeg;base64,maximal1'
};

const maxSolidColorBackground: SolidColorBackground = {
    type: 'solid',
    color: maxRGBColor
};

const maxGradientBackground: GradientBackground = {
    type: 'gradient',
    gradient: maxGradient
};

const maxBackground1: Background = maxImageBackground;
const maxBackground2: Background = maxSolidColorBackground;
const maxBackground3: Background = maxGradientBackground;

const maxImageElement1: ImageElement = {
    id: "img1",
    type: 'image',
    position: maxPosition1,
    size: maxSize1,
    data: 'data:image/png;base64,maximal1'
};

const maxImageElement2: ImageElement = {
    id: "img2",
    type: 'image',
    position: maxPosition2,
    size: maxSize2,
    data: 'data:image/jpeg;base64,maximal2'
};

const maxTextElement1: TextElement = {
    id: "text1",
    type: 'text',
    position: maxPosition1,
    size: maxSize1,
    content: "First maximal text content with more details",
    fontFamily: "Times New Roman",
    fontSize: 24,
    color: maxRGBColor
};

const maxTextElement2: TextElement = {
    id: "text2",
    type: 'text',
    position: maxPosition2,
    size: maxSize2,
    content: "Second maximal text with different styling",
    fontFamily: "Verdana",
    fontSize: 18,
    color: maxHEXColor
};

const maxSlide1: Slide = {
    id: "slide1",
    background: maxBackground1,
    elements: [maxImageElement1, maxTextElement1]
};

const maxSlide2: Slide = {
    id: "slide2",
    background: maxBackground2,
    elements: [maxImageElement2, maxTextElement2]
};

const maxSlide3: Slide = {
    id: "slide3",
    background: maxBackground3,
    elements: [maxImageElement1, maxTextElement2]
};

const maxSelection: Selection = {
    selectedSlideIds: ["slide1", "slide2"],
    selectedElementIds: ["img1", "text1"]
};

const maxPresentation: Presentation = {
    id: "pres2",
    title: "Maximal Presentation with Multiple Slides",
    slides: [maxSlide1, maxSlide2, maxSlide3],
    size: maxSize1,
    selection: maxSelection
};

// Тестирование функций
function testFunctions() {
    console.log("=== Тестирование с минимальными данными ===");

    // 1. renamePresentation
    const renamedMinimal = renamePresentation("New Minimal Name", minimalPresentation);
    console.log("renamePresentation minimal:", renamedMinimal.title === "New Minimal Name");

    // 2. addSlide
    const withAddedSlide = addSlide(minimalSlide, minimalPresentation);
    console.log("addSlide minimal:", withAddedSlide.slides.length === 1);

    // 3. removeSlide
    const presentationWithSlides = addSlide(minimalSlide, minimalPresentation);
    const afterRemove = removeSlide([minimalSlide.id], presentationWithSlides);
    console.log("removeSlide minimal:", afterRemove.slides.length === 0);

    // 4. moveSlide
    const presentationForMove = addSlide(minimalSlide, minimalPresentation);
    const afterMove = moveSlide(minimalSlide.id, 0, presentationForMove);
    console.log("moveSlide minimal:", afterMove.slides[0].id === minimalSlide.id);

    // 5. addElementToSlide
    const slideWithElement = addElementToSlide(minimalSlide.id, minimalTextElement, presentationForMove);
    console.log("addElementToSlide minimal:", slideWithElement.slides[0].elements.length === 1);

    // 6. removeElementsFromSlide
    const slideWithElements = addElementToSlide(minimalSlide.id, minimalTextElement, presentationForMove);
    const afterElementRemove = removeElementsFromSlide(minimalSlide.id, [minimalTextElement.id], slideWithElements);
    console.log("removeElementsFromSlide minimal:", afterElementRemove.slides[0].elements.length === 0);

    // 7. changeElPosition
    const newPosition: Position = { x: "50", y: "50" };
    const afterPositionChange = changeElPosition(minimalSlide.id, minimalTextElement.id, newPosition, slideWithElements);
    console.log("changeElPosition minimal:", afterPositionChange.slides[0].elements[0].position.x === "50");

    // 8. changeElSize
    const newSize: Size = { width: "200", height: "200" };
    const afterSizeChange = changeElSize(minimalSlide.id, minimalTextElement.id, newSize, slideWithElements);
    console.log("changeElSize minimal:", afterSizeChange.slides[0].elements[0].size.width === "200");

    // 9. changeTextElContent
    const afterContentChange = changeTextElContent(minimalSlide.id, minimalTextElement.id, "New content", slideWithElements);
    const textElement = afterContentChange.slides[0].elements[0] as TextElement;
    console.log("changeTextElContent minimal:", textElement.content === "New content");

    // 10. changeFontFamily
    const afterFontChange = changeFontFamily(minimalSlide.id, minimalTextElement.id, "Helvetica", slideWithElements);
    const textElementAfterFont = afterFontChange.slides[0].elements[0] as TextElement;
    console.log("changeFontFamily minimal:", textElementAfterFont.fontFamily === "Helvetica");

    // 11. changeSlideBg
    const afterBgChange = changeSlideBg(minimalSlide.id, minimalSolidColorBackground, presentationForMove);
    console.log("changeSlideBg minimal:", afterBgChange.slides[0].background?.type === 'solid');

    // 12. setSelectedSlides
    const afterSlideSelect = setSelectedSlides([minimalSlide.id], minimalPresentation);
    console.log("setSelectedSlides minimal:", afterSlideSelect.selection.selectedSlideIds[0] === minimalSlide.id);

    // 13. setSelectedElements
    const afterElementSelect = setSelectedElements([minimalTextElement.id], minimalPresentation);
    console.log("setSelectedElements minimal:", afterElementSelect.selection.selectedElementIds[0] === minimalTextElement.id);

    console.log("\n=== Тестирование с максимальными данными ===");

    // 1. renamePresentation
    const renamedMaximal = renamePresentation("New Maximal Name", maxPresentation);
    console.log("renamePresentation maximal:", renamedMaximal.title === "New Maximal Name");

    // 2. addSlide
    const newMaxSlide: Slide = {
        id: "slide4",
        background: maxGradientBackground,
        elements: [maxImageElement1, maxTextElement2]
    };
    const withAddedMaxSlide = addSlide(newMaxSlide, maxPresentation);
    console.log("addSlide maximal:", withAddedMaxSlide.slides.length === 4);

    // 3. removeSlide
    const afterMaxRemove = removeSlide(["slide2"], maxPresentation);
    console.log("removeSlide maximal:", afterMaxRemove.slides.length === 2);

    // 4. moveSlide
    const afterMaxMove = moveSlide("slide1", 2, maxPresentation);
    console.log("moveSlide maximal:", afterMaxMove.slides[2].id === "slide1");

    // 5. addElementToSlide
    const newTextElement: TextElement = {
        id: "text3",
        type: 'text',
        position: maxPosition1,
        size: maxSize1,
        content: "Additional text element",
        fontFamily: "Courier",
        fontSize: 14,
        color: maxHEXColor
    };
    const slideWithNewElement = addElementToSlide("slide1", newTextElement, maxPresentation);
    const targetSlide = slideWithNewElement.slides.find(s => s.id === "slide1");
    console.log("addElementToSlide maximal:", targetSlide?.elements.length === 3);

    // 6. removeElementsFromSlide
    const afterMaxElementRemove = removeElementsFromSlide("slide1", ["img1"], maxPresentation);
    const slideAfterRemove = afterMaxElementRemove.slides.find(s => s.id === "slide1");
    console.log("removeElementsFromSlide maximal:", slideAfterRemove?.elements.length === 1);

    // 7. changeElPosition
    const newMaxPosition: Position = { x: "150", y: "250" };
    const afterMaxPositionChange = changeElPosition("slide1", "img1", newMaxPosition, maxPresentation);
    const elementAfterPosition = afterMaxPositionChange.slides.find(s => s.id === "slide1")?.elements.find(e => e.id === "img1");
    console.log("changeElPosition maximal:", elementAfterPosition?.position.x === "150");

    // 8. changeElSize
    const newMaxSize: Size = { width: "600", height: "400" };
    const afterMaxSizeChange = changeElSize("slide1", "img1", newMaxSize, maxPresentation);
    const elementAfterSize = afterMaxSizeChange.slides.find(s => s.id === "slide1")?.elements.find(e => e.id === "img1");
    console.log("changeElSize maximal:", elementAfterSize?.size.width === "600");

    // 9. changeTextElContent
    const afterMaxContentChange = changeTextElContent("slide1", "text1", "Updated maximal content", maxPresentation);
    const textElementMax = afterMaxContentChange.slides.find(s => s.id === "slide1")?.elements.find(e => e.id === "text1") as TextElement;
    console.log("changeTextElContent maximal:", textElementMax?.content === "Updated maximal content");

    // 10. changeFontFamily
    const afterMaxFontChange = changeFontFamily("slide1", "text1", "Georgia", maxPresentation);
    const textElementAfterMaxFont = afterMaxFontChange.slides.find(s => s.id === "slide1")?.elements.find(e => e.id === "text1") as TextElement;
    console.log("changeFontFamily maximal:", textElementAfterMaxFont?.fontFamily === "Georgia");

    // 11. changeSlideBg
    const afterMaxBgChange = changeSlideBg("slide1", maxGradientBackground, maxPresentation);
    const slideAfterBgChange = afterMaxBgChange.slides.find(s => s.id === "slide1");
    console.log("changeSlideBg maximal:", slideAfterBgChange?.background?.type === 'gradient');

    // 12. setSelectedSlides
    const afterMaxSlideSelect = setSelectedSlides(["slide3"], maxPresentation);
    console.log("setSelectedSlides maximal:", afterMaxSlideSelect.selection.selectedSlideIds[0] === "slide3");

    // 13. setSelectedElements
    const afterMaxElementSelect = setSelectedElements(["img2", "text2"], maxPresentation);
    console.log("setSelectedElements maximal:",
        afterMaxElementSelect.selection.selectedElementIds.includes("img2") &&
        afterMaxElementSelect.selection.selectedElementIds.includes("text2")
    );

    console.log("\n=== Все тесты завершены ===");
}

// Запуск тестов
testFunctions();