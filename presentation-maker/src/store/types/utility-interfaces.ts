import type { Theme } from './utility-types.ts';

interface ThemeInterface {
  theme: Theme;
  toggleTheme(): void;
}

interface AppwriteException {
  code: number;
  message: string;
  type: string;
  response: string;
}

export type { ThemeInterface, AppwriteException };
