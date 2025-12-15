import type {
  Presentation,
  RectangleElement,
  Slide,
  TextElement,
} from '../types/types';
import { PRESENTATION_SIZE } from './config.ts';
import { LANGUAGES } from './langs.ts';
import type { RefObject } from 'react';

export function getRandomId() {
  return crypto.randomUUID();
}

export function concatClassNames(
  classNames: (string | undefined | null | boolean)[]
): string {
  return classNames.filter(Boolean).join(' ');
}

export function getPercentValue(v1: number, v2: number): number {
  return (v1 / v2) * 100;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    // HH:mm
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    const day = date.getDate();
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
}

export const deselectInputAndBlur = (
  inputRef: RefObject<HTMLInputElement | null>
) => {
  if (inputRef.current) {
    const input = inputRef.current;
    input.selectionStart = input.selectionEnd; // снимает выделение текста
    input.blur(); // убирает фокус
  }
};

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
      width: 0,
      height: 0,
    },
    background: {
      type: 'solid',
      color: '#f0f0f0',
    },
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
      width: 0,
      height: 0,
    },
    background: {
      type: 'solid',
      color: '#f0f0f0',
    },
    type: 'rectangle',
  };
}

export const createNewPresentation = (): Presentation => {
  return {
    id: getRandomId(),
    title: LANGUAGES.ru.newPresentationTitle,
    slides: [createDefaultSlide()],
    size: {
      width: PRESENTATION_SIZE.width,
      height: PRESENTATION_SIZE.height,
    },
  };
};
