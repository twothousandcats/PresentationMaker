import type { Position, Size } from './types.ts';

type ResizeItem =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topLeft'
  | 'topRight'
  | 'bottomRight'
  | 'bottomLeft';

type ResizePreview = {
  size: Size;
  position: Position;
};

type Theme = 'light' | 'dark';

export type { ResizeItem, Theme, ResizePreview };
