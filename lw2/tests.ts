import {
    ImageElement,
    Position,
    Presentation,
    Size,
    Slide,
    SlideBackground,
    TextElement
} from '../lw1/lw1_4/types/types';

import {
    addImageElement,
    addSlide,
    addTextElement,
    changeElementPosition,
    changeElementSize,
    changeSlideBackground,
    changeText,
    changeTextColor,
    changeTextFontFamily,
    changeTextFontSize,
    deleteElements,
    deleteSlides,
    moveSlide,
    renamePresentation,
} from '../lw1/lw1_4/functions/functions';

// Минимальные тестовые данные
const minimalPosition: Position = {x: 0, y: 0};
const minimalSize: Size = {width: 100, height: 100};

const minimalTextElement: TextElement = {
    id: "text1",
    kind: 'text',
    text: "Hello",
    position: minimalPosition,
    size: minimalSize,
    fontWeight: 400,
    fontFam: "Arial",
    fontSize: 16,
    color: "#000000"
};

const minimalImageElement: ImageElement = {
    id: "img1",
    kind: 'image',
    src: "image.jpg",
    position: minimalPosition,
    size: minimalSize
};

const minimalSlide: Slide = {
    id: "slide1",
    background: {type: 'none'},
    elements: [],
    selectedElementIds: []
};

const minimalPresentation: Presentation = {
    id: 1,
    title: "Minimal Presentation",
    slides: [minimalSlide],
    selectedSlideId: "slide1"
};

// Максимальные тестовые данные
const maxPosition1: Position = {x: 10, y: 20};
const maxPosition2: Position = {x: 50, y: 100};
const maxSize1: Size = {width: 200, height: 150};
const maxSize2: Size = {width: 300, height: 200};

const maxTextElement1: TextElement = {
    id: "text1",
    kind: 'text',
    text: "Hello World",
    position: maxPosition1,
    size: maxSize1,
    fontWeight: 700,
    fontFam: "Times New Roman",
    fontSize: 24,
    color: "#FF0000"
};

const maxTextElement2: TextElement = {
    id: "text2",
    kind: 'text',
    text: "Another text",
    position: maxPosition2,
    size: maxSize2,
    fontWeight: 400,
    fontFam: "Verdana",
    fontSize: 18,
    color: "#0000FF"
};

const maxImageElement1: ImageElement = {
    id: "img1",
    kind: 'image',
    src: "image1.jpg",
    position: maxPosition1,
    size: maxSize1
};

const maxImageElement2: ImageElement = {
    id: "img2",
    kind: 'image',
    src: "image2.png",
    position: maxPosition2,
    size: maxSize2
};

const maxSlide1: Slide = {
    id: "slide1",
    background: {type: 'color', color: "#FFFFFF"},
    elements: [maxTextElement1, maxImageElement1],
    selectedElementIds: ["text1"]
};

const maxSlide2: Slide = {
    id: "slide2",
    background: {type: 'image', src: "background.jpg"},
    elements: [maxTextElement2, maxImageElement2],
    selectedElementIds: ["img2"]
};

const maxSlide3: Slide = {
    id: "slide3",
    background: {type: 'gradient', colors: ["#FF0000", "#0000FF"]},
    elements: [],
    selectedElementIds: []
};

const maxPresentation: Presentation = {
    id: 2,
    title: "Maximal Presentation",
    slides: [maxSlide1, maxSlide2, maxSlide3],
    selectedSlideId: "slide1"
};

// Тестирование функций
function testFunctions() {
    console.log("=== Тестирование с минимальными данными ===");

    // 1. Изменение названия презентации
    const renamedMinimal = renamePresentation("New Minimal Title", minimalPresentation);
    console.log("renamePresentation:", renamedMinimal.title === "New Minimal Title");

    // 2. Добавление слайда
    const newMinimalSlide: Slide = {
        id: "slide2",
        background: {type: 'none'},
        elements: [],
        selectedElementIds: []
    };
    const withAddedSlide = addSlide(newMinimalSlide, minimalPresentation);
    console.log("addSlide:", withAddedSlide.slides.length === 2);

    // 3. Удаление слайда
    const withDeletedSlide = deleteSlides(["slide2"], withAddedSlide);
    console.log("deleteSlides:", withDeletedSlide.slides.length === 1);

    // 4. Перемещение слайда
    const movedSlide = moveSlide(0, 0, minimalPresentation); // перемещение на ту же позицию
    console.log("moveSlide:", movedSlide.slides[0].id === "slide1");

    // 5. Добавление текстового элемента
    const withTextElement = addTextElement(minimalSlide, minimalTextElement);
    console.log("addTextElement:", withTextElement.elements.length === 1);

    // 6. Добавление графического элемента
    const withImageElement = addImageElement(minimalSlide, minimalImageElement);
    console.log("addImageElement:", withImageElement.elements.length === 1);

    // 7. Удаление элементов
    const slideWithElements: Slide = {
        ...minimalSlide,
        elements: [minimalTextElement, minimalImageElement]
    };
    const withoutElements = deleteElements(slideWithElements, ["text1", "img1"]);
    console.log("deleteElements:", withoutElements.elements.length === 0);

    // 8. Изменение позиции элемента
    const newPosition: Position = {x: 50, y: 50};
    const withMovedElement = changeElementPosition(slideWithElements, "text1", newPosition);
    console.log("changeElementPosition:",
        (withMovedElement.elements[0] as TextElement).position.x === 50);

    // 9. Изменение размера элемента
    const newSize: Size = {width: 200, height: 200};
    const withResizedElement = changeElementSize(slideWithElements, "text1", newSize);
    console.log("changeElementSize:",
        (withResizedElement.elements[0] as TextElement).size.width === 200);

    // 10. Изменение текста
    const withChangedText = changeText(slideWithElements, "text1", "New Text");
    console.log("changeText:",
        (withChangedText.elements[0] as TextElement).text === "New Text");

    // 11. Изменение размера текста
    const withChangedFontSize = changeTextFontSize(slideWithElements, "text1", 20);
    console.log("changeTextFontSize:",
        (withChangedFontSize.elements[0] as TextElement).fontSize === 20);

    // 12. Изменение семейства шрифтов
    const withChangedFontFamily = changeTextFontFamily(slideWithElements, "text1", "Verdana");
    console.log("changeTextFontFamily:",
        (withChangedFontFamily.elements[0] as TextElement).fontFam === "Verdana");

    // 13. Изменение цвета текста
    const withChangedColor = changeTextColor(slideWithElements, "text1", "#FF0000");
    console.log("changeTextColor:",
        (withChangedColor.elements[0] as TextElement).color === "#FF0000");

    // 14. Изменение фона слайда
    const newBackground: SlideBackground = {type: 'color', color: "#FFFFFF"};
    const withChangedBackground = changeSlideBackground(minimalSlide, newBackground);
    console.log("changeSlideBackground:", withChangedBackground.background.type === 'color');

    console.log("\n=== Тестирование с максимальными данными ===");

    // 1. Изменение названия презентации
    const renamedMaximal = renamePresentation("New Maximal Title", maxPresentation);
    console.log("renamePresentation:", renamedMaximal.title === "New Maximal Title");

    // 2. Добавление слайда
    const newMaxSlide: Slide = {
        id: "slide4",
        background: {type: 'none'},
        elements: [],
        selectedElementIds: []
    };
    const withAddedMaxSlide = addSlide(newMaxSlide, maxPresentation, 1);
    console.log("addSlide:", withAddedMaxSlide.slides.length === 4);

    // 3. Удаление слайда
    const withDeletedMaxSlide = deleteSlides(["slide2"], maxPresentation);
    console.log("deleteSlides:", withDeletedMaxSlide.slides.length === 2);

    // 4. Перемещение слайда
    const movedMaxSlide = moveSlide(0, 2, maxPresentation);
    console.log("moveSlide:", movedMaxSlide.slides[2].id === "slide1");

    // 5. Добавление текстового элемента
    const slideToModify = maxPresentation.slides[0];
    const withMaxTextElement = addTextElement(slideToModify, maxTextElement2);
    console.log("addTextElement:", withMaxTextElement.elements.length === 3);

    // 6. Добавление графического элемента
    const withMaxImageElement = addImageElement(slideToModify, maxImageElement2);
    console.log("addImageElement:", withMaxImageElement.elements.length === 3);

    // 7. Удаление элементов
    const withoutMaxElements = deleteElements(slideToModify, ["text1", "img1"]);
    console.log("deleteElements:", withoutMaxElements.elements.length === 0);

    // 8. Изменение позиции элемента
    const newMaxPosition: Position = {x: 100, y: 200};
    const withMovedMaxElement = changeElementPosition(slideToModify, "text1", newMaxPosition);
    console.log("changeElementPosition:",
        (withMovedMaxElement.elements[0] as TextElement).position.x === 100);

    // 9. Изменение размера элемента
    const newMaxSize: Size = {width: 500, height: 400};
    const withResizedMaxElement = changeElementSize(slideToModify, "text1", newMaxSize);
    console.log("changeElementSize:",
        (withResizedMaxElement.elements[0] as TextElement).size.width === 500);

    // 10. Изменение текста
    const withChangedMaxText = changeText(slideToModify, "text1", "Updated Text");
    console.log("changeText:",
        (withChangedMaxText.elements[0] as TextElement).text === "Updated Text");

    // 11. Изменение размера текста
    const withChangedMaxFontSize = changeTextFontSize(slideToModify, "text1", 32);
    console.log("changeTextFontSize:",
        (withChangedMaxFontSize.elements[0] as TextElement).fontSize === 32);

    // 12. Изменение семейства шрифтов
    const withChangedMaxFontFamily = changeTextFontFamily(slideToModify, "text1", "Georgia");
    console.log("changeTextFontFamily:",
        (withChangedMaxFontFamily.elements[0] as TextElement).fontFam === "Georgia");

    // 13. Изменение цвета текста
    const withChangedMaxColor = changeTextColor(slideToModify, "text1", "#00FF00");
    console.log("changeTextColor:",
        (withChangedMaxColor.elements[0] as TextElement).color === "#00FF00");

    // 14. Изменение фона слайда
    const newMaxBackground: SlideBackground = {
        type: 'gradient',
        colors: ["#000000", "#FFFFFF"]
    };
    const withChangedMaxBackground = changeSlideBackground(slideToModify, newMaxBackground);
    console.log("changeSlideBackground:", withChangedMaxBackground.background.type === 'gradient');

    console.log("\n=== Проверка иммутабельности ===");
    console.log("Исходные данные не изменены:",
        minimalPresentation.title === "Minimal Presentation" &&
        maxPresentation.title === "Maximal Presentation");
}

// Запуск тестов
testFunctions();