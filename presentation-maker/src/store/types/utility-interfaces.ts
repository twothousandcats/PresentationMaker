import type {Theme} from "./utility-types.ts";

interface ThemeInterface {
    theme: Theme;
    toggleTheme(): void;
}

export type {
    ThemeInterface,
}