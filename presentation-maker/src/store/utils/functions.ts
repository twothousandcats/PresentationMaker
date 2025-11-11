import type {
  RectangleElement,
  Slide,
  TextElement,
} from '../types/types';

export function getRandomId() {
  return crypto.randomUUID();
}

export function concatModifiersByFlag(classNames: string[]) {
  let modifiers = '';
  classNames.forEach((className) => {
    modifiers += ' ' + className;
  });
  return modifiers;
}

export function getPercentValue(v1: number, v2: number): number {
  return (v1 / v2) * 100;
}

export function createDefaultSlide(): Slide {
  return {
    id: getRandomId(),
    background: {
      type: 'solid',
      color: '#fff',
    },
    elements: [],
  };
}

export function createTextEl(): TextElement {
  return {
    id: getRandomId(),
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 50,
      height: 50,
    },
    background: null,
    type: 'text',
    content: '',
    fontFamily: 'Arial',
    fontSize: 14,
    fontWeight: 400,
    color: '#000',
  };
}

export function createRectangleEl(): RectangleElement {
  return {
    id: getRandomId(),
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 200,
      height: 200,
    },
    background: null,
    type: 'rectangle',
  };
}
