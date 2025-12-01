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
type AuthMode = 'login' | 'register';
type ValidationError = {
  email?: string;
  password?: string;
  name?: string;
};

export type { ResizeItem, Theme, ResizePreview, AuthMode, ValidationError };
