/* import {
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
const minimalPosition: Position = { x: "0", y: "0" };
const minimalSize: Size = { width: "100", height: "100" };

const minimalTextElement: TextElement = {
    id: "text-min",
    type: "text",
    position: minimalPosition,
    size: minimalSize,
    content: "Minimal text",
    fontFamily: "Arial",
    fontSize: 12,
    color: "#000000"
};

const minimalImageElement: ImageElement = {
    id: "img-min",
    type: "image",
    position: minimalPosition,
    size: minimalSize,
    data: "data:image/png;base64,minimal"
};

const minimalSlide: Slide = {
    id: "slide-min",
    background: null,
    elements: []
};

const minimalSelection: Selection = {
    selectedSlideIds: [],
    selectedElementIds: []
};

const minimalPresentation: Presentation = {
    id: "pres-min",
    title: "Minimal Presentation",
    slides: [],
    size: minimalSize,
    selection: minimalSelection
};

// Максимальные тестовые данные
const maxPosition1: Position = { x: "10", y: "20" };
const maxPosition2: Position = { x: "30", y: "40" };
const maxSize1: Size = { width: "200", height: "150" };
const maxSize2: Size = { width: "300", height: "250" };

const rgbColor: RGBColor = "rgb(255, 0, 0)";
const hexColor: HEXColor = "#00FF00";
const gradient: Gradient = {
    angle: 45,
    colors: [rgbColor, hexColor]
};

const solidBg: SolidColorBackground = {
    type: "solid",
    color: rgbColor
};

const gradientBg: GradientBackground = {
    type: "gradient",
    gradient: gradient
};

const imageBg: ImageBackground = {
    type: "image",
    data: "data:image/jpeg;base64,maximal"
};

const maxTextElement1: TextElement = {
    id: "text-max-1",
    type: "text",
    position: maxPosition1,
    size: maxSize1,
    content: "First maximal text",
    fontFamily: "Times New Roman",
    fontSize: 16,
    color: rgbColor
};

const maxTextElement2: TextElement = {
    id: "text-max-2",
    type: "text",
    position: maxPosition2,
    size: maxSize2,
    content: "Second maximal text",
    fontFamily: "Verdana",
    fontSize: 18,
    color: hexColor
};

const maxImageElement1: ImageElement = {
    id: "img-max-1",
    type: "image",
    position: maxPosition1,
    size: maxSize1,
    data: "data:image/png;base64,first"
};

const maxImageElement2: ImageElement = {
    id: "img-max-2",
    type: "image",
    position: maxPosition2,
    size: maxSize2,
    data: "data:image/jpeg;base64,second"
};

const maxSlide1: Slide = {
    id: "slide-max-1",
    background: solidBg,
    elements: [maxTextElement1, maxImageElement1]
};

const maxSlide2: Slide = {
    id: "slide-max-2",
    background: gradientBg,
    elements: [maxTextElement2, maxImageElement2]
};

const maxSelection: Selection = {
    selectedSlideIds: ["slide-max-1"],
    selectedElementIds: ["text-max-1", "img-max-1"]
};

const maxPresentation: Presentation = {
    id: "pres-max",
    title: "Maximal Presentation",
    slides: [maxSlide1, maxSlide2],
    size: maxSize1,
    selection: maxSelection
};

// Тесты для каждой функции
describe("Presentation Functions Tests", () => {
    describe("renamePresentation", () => {
        test("with minimal data", () => {
            const newName = "New Minimal Name";
            const result = renamePresentation(newName, minimalPresentation);

            expect(result.title).toBe(newName);
            expect(result).toEqual({
                ...minimalPresentation,
                title: newName
            });
        });

        test("with maximal data", () => {
            const newName = "New Maximal Name";
            const result = renamePresentation(newName, maxPresentation);

            expect(result.title).toBe(newName);
            expect(result.slides.length).toBe(2);
            expect(result.selection.selectedSlideIds).toEqual(["slide-max-1"]);
        });
    });

    describe("addSlide", () => {
        test("with minimal data", () => {
            const result = addSlide(minimalSlide, minimalPresentation);

            expect(result.slides.length).toBe(1);
            expect(result.slides[0]).toEqual(minimalSlide);
        });

        test("with maximal data", () => {
            const newSlide: Slide = {
                id: "new-slide",
                background: imageBg,
                elements: [maxTextElement1]
            };

            const result = addSlide(newSlide, maxPresentation);

            expect(result.slides.length).toBe(3);
            expect(result.slides[2]).toEqual(newSlide);
        });
    });

    describe("removeSlide", () => {
        test("with minimal data", () => {
            const presWithSlide = addSlide(minimalSlide, minimalPresentation);
            const result = removeSlide([minimalSlide.id], presWithSlide);

            expect(result.slides.length).toBe(0);
            expect(result.selection.selectedSlideIds.length).toBe(0);
        });

        test("with maximal data", () => {
            const result = removeSlide(["slide-max-1"], maxPresentation);

            expect(result.slides.length).toBe(1);
            expect(result.slides[0].id).toBe("slide-max-2");
            expect(result.selection.selectedSlideIds.length).toBe(0);
        });
    });

    describe("moveSlide", () => {
        test("with minimal data", () => {
            const slide1: Slide = { ...minimalSlide, id: "slide1" };
            const slide2: Slide = { ...minimalSlide, id: "slide2" };
            let pres = addSlide(slide1, minimalPresentation);
            pres = addSlide(slide2, pres);

            const result = moveSlide("slide1", 1, pres);

            expect(result.slides[0].id).toBe("slide2");
            expect(result.slides[1].id).toBe("slide1");
        });

        test("with maximal data", () => {
            const result = moveSlide("slide-max-1", 1, maxPresentation);

            expect(result.slides[0].id).toBe("slide-max-2");
            expect(result.slides[1].id).toBe("slide-max-1");
        });
    });

    describe("addElementToSlide", () => {
        test("with minimal data", () => {
            const presWithSlide = addSlide(minimalSlide, minimalPresentation);
            const result = addElementToSlide(minimalSlide.id, minimalTextElement, presWithSlide);

            expect(result.slides[0].elements.length).toBe(1);
            expect(result.slides[0].elements[0]).toEqual(minimalTextElement);
        });

        test("with maximal data", () => {
            const newElement: TextElement = {
                ...maxTextElement1,
                id: "new-text-element"
            };

            const result = addElementToSlide("slide-max-1", newElement, maxPresentation);

            expect(result.slides[0].elements.length).toBe(3);
            expect(result.slides[0].elements[2]).toEqual(newElement);
        });
    });

    describe("removeElementsFromSlide", () => {
        test("with minimal data", () => {
            const slideWithElement: Slide = {
                ...minimalSlide,
                elements: [minimalTextElement]
            };
            const pres = addSlide(slideWithElement, minimalPresentation);
            const result = removeElementsFromSlide(minimalSlide.id, [minimalTextElement.id], pres);

            expect(result.slides[0].elements.length).toBe(0);
        });

        test("with maximal data", () => {
            const result = removeElementsFromSlide("slide-max-1", ["text-max-1"], maxPresentation);

            expect(result.slides[0].elements.length).toBe(1);
            expect(result.slides[0].elements[0].id).toBe("img-max-1");
            expect(result.selection.selectedElementIds).toEqual(["img-max-1"]);
        });
    });

    describe("changeElPosition", () => {
        test("with minimal data", () => {

            const slideWithElement: Slide = {
                ...minimalSlide,
                elements: [minimalTextElement]
            };
            const pres = addSlide(slideWithElement, minimalPresentation);
            const newPosition: Position = { x: "50", y: "50" };

            const result = changeElPosition(minimalSlide.id, minimalTextElement.id, newPosition, pres);

            expect(result.slides[0].elements[0].position).toEqual(newPosition);
        });

        test("with maximal data", () => {
            const newPosition: Position = { x: "999", y: "888" };
            const result = changeElPosition("slide-max-1", "text-max-1", newPosition, maxPresentation);

            expect(result.slides[0].elements[0].position).toEqual(newPosition);
            expect(result.slides[0].elements[1].position).toEqual(maxPosition1);
        });
    });

    describe("changeElSize", () => {
        test("with minimal data", () => {
            const slideWithElement: Slide = {
                ...minimalSlide,
                elements: [minimalTextElement]
            };
            const pres = addSlide(slideWithElement, minimalPresentation);
            const newSize: Size = { width: "500", height: "300" };

            const result = changeElSize(minimalSlide.id, minimalTextElement.id, newSize, pres);

            expect(result.slides[0].elements[0].size).toEqual(newSize);
        });

        test("with maximal data", () => {
            const newSize: Size = { width: "800", height: "600" };
            const result = changeElSize("slide-max-1", "img-max-1", newSize, maxPresentation);

            expect(result.slides[0].elements[1].size).toEqual(newSize);
        });
    });

    describe("changeTextElContent", () => {
        test("with minimal data", () => {
            const slideWithElement: Slide = {
                ...minimalSlide,
                elements: [minimalTextElement]
            };
            const pres = addSlide(slideWithElement, minimalPresentation);
            const newContent = "Updated content";

            const result = changeTextElContent(minimalSlide.id, minimalTextElement.id, newContent, pres);

            expect((result.slides[0].elements[0] as TextElement).content).toBe(newContent);
        });

        test("with maximal data", () => {
            const newContent = "Completely new text content";
            const result = changeTextElContent("slide-max-1", "text-max-1", newContent, maxPresentation);

            expect((result.slides[0].elements[0] as TextElement).content).toBe(newContent);
        });
    });

    describe("changeFontFamily", () => {
        test("with minimal data", () => {
            const slideWithElement: Slide = {
                ...minimalSlide,
                elements: [minimalTextElement]
            };
            const pres = addSlide(slideWithElement, minimalPresentation);
            const newFont = "Courier New";

            const result = changeFontFamily(minimalSlide.id, minimalTextElement.id, newFont, pres);

            expect((result.slides[0].elements[0] as TextElement).fontFamily).toBe(newFont);
        });

        test("with maximal data", () => {
            const newFont = "Comic Sans MS";
            const result = changeFontFamily("slide-max-2", "text-max-2", newFont, maxPresentation);

            expect((result.slides[1].elements[0] as TextElement).fontFamily).toBe(newFont);
        });
    });

    describe("changeSlideBg", () => {
        test("with minimal data", () => {
            const newBg: SolidColorBackground = {
                type: "solid",
                color: "#FF0000"
            };

            const presWithSlide = addSlide(minimalSlide, minimalPresentation);
            const result = changeSlideBg(minimalSlide.id, newBg, presWithSlide);

            expect(result.slides[0].background).toEqual(newBg);
        });

        test("with maximal data", () => {
            const result = changeSlideBg("slide-max-1", imageBg, maxPresentation);

            expect(result.slides[0].background).toEqual(imageBg);
            expect(result.slides[1].background).toEqual(gradientBg); // Другой слайд не изменился
        });
    });

    describe("setSelectedSlides", () => {
        test("with minimal data", () => {
            const slideIds = ["non-existent-id"];
            const result = setSelectedSlides(slideIds, minimalPresentation);

            expect(result.selection.selectedSlideIds).toEqual(slideIds);
        });

        test("with maximal data", () => {
            const slideIds = ["slide-max-2"];
            const result = setSelectedSlides(slideIds, maxPresentation);

            expect(result.selection.selectedSlideIds).toEqual(slideIds);
        });
    });

    describe("setSelectedElements", () => {
        test("with minimal data", () => {
            const elementIds = ["non-existent-id"];
            const result = setSelectedElements(elementIds, minimalPresentation);

            expect(result.selection.selectedElementIds).toEqual(elementIds);
        });

        test("with maximal data", () => {
            const elementIds = ["img-max-2"];
            const result = setSelectedElements(elementIds, maxPresentation);

            expect(result.selection.selectedElementIds).toEqual(elementIds);
        });
    });
}); */