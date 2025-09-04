// export type SlideBackground =
//     | { type: 'none' }
//     | { type: 'color'; color: string }
//     | { type: 'image'; src: string }
//     | { type: 'gradient'; colors: string[]
// };

export type Position = {
    x: number;
    y: number
}

export type Size = {
    width: number;
    height: number
};

export type ImageElement = {
    id: string;
    src: string;
    position: Position;
    size: Size
};

export type TextElement = {
    id: string;
    text: string;
    position: Position;
    size: Size;
    fontWeight: number;
    fontFam: string;
    fontSize: number;
    color: string
};

export type SlideElement =
    | TextElement
    | ImageElement;

export type Selection = {
    selectedSlideIds: string[];
    selectedElementIds: string[]
};

export type SlideCollection = Slide[];

export type Slide = {
    id: string;
    // background: SlideBackground;
    elements: SlideElement[];
    selectedElementIds: string[]
};

export type Presentation = {
    id: number;
    title: string;
    slides: SlideCollection;
    selectedSlideId: string | null
}