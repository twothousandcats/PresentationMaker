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

// appwrite
export type Credentials = {
  email: string;
  password: string;
};

export type UserData = Credentials & {
  name: string;
};

type ValidationError = {
  email?: string;
  password?: string;
  name?: string;
};

type ToastType = 'error' | 'success' | 'info' | 'saving';

type ToastProps = {
  message: string;
  visible: boolean;
  type?: ToastType;
  duration?: number;
};

export type {
  ResizeItem,
  Theme,
  ResizePreview,
  AuthMode,
  ValidationError,
  ToastType,
  ToastProps,
};
