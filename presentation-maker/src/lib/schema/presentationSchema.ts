
// Определим подтипы
type Position = { x: number; y: number };
type Size = { width: number; height: number };
type Color = string; // ajv не поддерживает шаблонные строки
type Gradient = { angle: number; colors: Color[] };

type ImageBackground = { type: 'image'; data: string };
type SolidColorBackground = { type: 'solid'; color: Color };
type GradientBackground = { type: 'gradient'; gradient: Gradient };
type Background =
  | ImageBackground
  | SolidColorBackground
  | GradientBackground
  | null;

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

// Ожидаемый интерфейс
export interface SavedPresentation {
  id: string;
  title: string;
  slides: Slide[];
  size: Size;
}

// Вспомогательные схемы
const positionSchema = {
  type: 'object',
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
  },
  required: ['x', 'y'],
  additionalProperties: false,
} as const;

const sizeSchema = {
  type: 'object',
  properties: {
    width: { type: 'number', minimum: 1 },
    height: { type: 'number', minimum: 1 },
  },
  required: ['width', 'height'],
  additionalProperties: false,
} as const;

const colorSchema = {
  type: 'string',
  pattern:
    '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\\(\\s*\\d{1,3}\\s*,\\s*\\d{1,3}\\s*,\\s*\\d{1,3}\\s*\\)$',
} as const;

/* const gradientSchema = {
  type: 'object',
  properties: {
    angle: { type: 'number' },
    colors: {
      type: 'array',
      items: colorSchema,
      minItems: 2,
    },
  },
  required: ['angle', 'colors'],
  additionalProperties: false,
} as const; */

const backgroundSchema = {
  type: ['object', 'null'],
  nullable: true,
  oneOf: [
    { type: 'null' },
    {
      type: 'object',
      properties: { type: { const: 'image' }, data: { type: 'string' } },
      required: ['type', 'data'],
      additionalProperties: false,
    },
    {
      type: 'object',
      properties: { type: { const: 'solid' }, color: colorSchema },
      required: ['type', 'color'],
      additionalProperties: false,
    },
  ],
} as const;

const defaultElementPropsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1 },
    position: positionSchema,
    size: sizeSchema,
    background: backgroundSchema,
  },
  required: ['id', 'position', 'size', 'background'],
  additionalProperties: false,
} as const;

const textElementSchema = {
  ...defaultElementPropsSchema,
  properties: {
    ...defaultElementPropsSchema.properties,
    type: { const: 'text' },
    content: { type: 'string' },
    fontFamily: { type: 'string' },
    fontSize: { type: 'number', minimum: 1 },
    fontWeight: { type: 'number', minimum: 100, maximum: 900 },
    color: colorSchema,
  },
  required: [
    ...defaultElementPropsSchema.required,
    'type',
    'content',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'color',
  ],
} as const;

const rectangleElementSchema = {
  ...defaultElementPropsSchema,
  properties: {
    ...defaultElementPropsSchema.properties,
    type: { const: 'rectangle' },
  },
  required: [...defaultElementPropsSchema.required, 'type'],
} as const;

const imageElementSchema = {
  ...defaultElementPropsSchema,
  properties: {
    ...defaultElementPropsSchema.properties,
    type: { const: 'image' },
    src: { type: 'string' },
    alt: { type: 'string' },
  },
  required: [...defaultElementPropsSchema.required, 'type', 'src', 'alt'],
} as const;

const slideElementSchema = {
  oneOf: [textElementSchema, rectangleElementSchema, imageElementSchema],
} as const;

const slideSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1 },
    background: backgroundSchema,
    elements: {
      type: 'array',
      items: slideElementSchema,
      minItems: 0,
    },
  },
  required: ['id', 'background', 'elements'],
  additionalProperties: false,
} as const;

// Основная схема
export const presentationSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1 },
    title: { type: 'string', minLength: 1 },
    slides: {
      type: 'array',
      items: slideSchema,
      minItems: 1,
    },
    size: sizeSchema,
  },
  required: ['id', 'title', 'slides', 'size'],
  additionalProperties: false,
} as const;
