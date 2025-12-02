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
  data: string;
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

type ImageElement = DefaultElementProps & {
  type: 'image';
  src: string;
  alt: string;
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

type SlideElement = TextElement | RectangleElement | ImageElement;

type Slide = {
  id: string;
  background: Background;
  elements: SlideElement[];
};

type Selection = {
  selectedSlideIds: string[];
  selectedElementIds: string[];
};

type Idle = {
  type: 'idle';
};

type Placing = {
  type: 'placing';
  elementType: 'rectangle' | 'text';
};

type EditorMode = Idle | Placing;

type Presentation = {
  id: string;
  title: string;
  slides: Slide[];
  size: Size;
  isNew: boolean;
};

// UI-состояние
type UIState = {
  selection: Selection;
  mode: EditorMode;
  lastAppliedContext?: HistoryContext;
};

// Контекст действия
type HistoryContext = {
  readonly affectedSlideIds: string[];
  readonly affectedElementIds: string[];
  readonly scrollTargetSlideId?: string;
};

// Запись в истории
type HistoryEntry = {
  presentation: Presentation;
  context: HistoryContext;
};

type PresentationHistory = {
  past: HistoryEntry[];
  present: HistoryEntry;
  future: HistoryEntry[];
};

// Состояние редактора
type EditorState = {
  presentationHistory: PresentationHistory;
  ui: UIState;
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
  EditorMode,
  EditorState,
  Presentation,
  HistoryEntry,
};
