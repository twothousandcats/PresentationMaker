type Position = {
    x: number;
    y: number
}

type Size = {
    width: number;
    height: number
}

type RGBColor = `rgb(${number}, ${number}, ${number})`;
type HEXColor = `#${string}`;
type Color = RGBColor | HEXColor;

type Gradient = {
    angle: number;
    colors: Color[];
};

type ImageBackground = {
    type: 'image';
    data: string; // base64/URL
};

type SolidColorBackground = {
    type: 'solid';
    color: Color;
};

type GradientBackground = {
    type: 'gradient';
    gradient: Gradient;
};

type Background = ImageBackground
    | SolidColorBackground
    | GradientBackground
    | null;

type DefaultElementProps = {
    id: string;
    position: Position;
    size: Size;
    background: Background;
}

type ImageElement = DefaultElementProps & {
    type: 'image';
    data: string; // base64/URL
}

type TextElement = DefaultElementProps & {
    type: 'text';
    content: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    color: Color;
}

type SlideElement = TextElement | ImageElement;

type Slide = {
    id: string;
    background: Background;
    elements: SlideElement[]
}

type Selection = {
    selectedSlideIds: string[];
    selectedElementIds: string[]
}

type Presentation = {
    id: string;
    title: string;
    slides: Slide[];
    size: Size;
    selection: Selection
}

// type History = {
//     past: Presentation[];
//     present: Presentation;
//     future: Presentation[]
// }

export type {
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
}