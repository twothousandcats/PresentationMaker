type Position = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

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

type Background =
  | ImageBackground
  | SolidColorBackground
  | GradientBackground
  | null;

type GradientBackground = {
  type: 'gradient';
  gradient: Gradient;
};

type DefaultElementProps = {
  id: string;
  position: Position;
  size: Size;
  background: Background;
};

type RectangleElement = DefaultElementProps & {
  type: 'rectangle';
};

type TextElement = DefaultElementProps & {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: Color;
};

type SlideElement = TextElement | RectangleElement;

type Slide = {
  id: string;
  background: Background;
  elements: SlideElement[];
};

type Selection = {
  selectedSlideIds: string[];
  selectedElementIds: string[];
};

type Presentation = {
  id: string;
  title: string;
  slides: Slide[];
  size: Size;
  selection: Selection;
  mode: EditorMode;
};

type Idle = {
  type: 'idle';
};

type Placing = {
  type: 'placing';
  elementType: 'rectangle' | 'text';
};

type EditorMode = Idle | Placing;

type History = {
  past: Presentation[] | [];
  present: Presentation;
  future: Presentation[] | [];
};

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
  RectangleElement,
  TextElement,
  SlideElement,
  Slide,
  Selection,
  Presentation,
  EditorMode,
  History,
};
