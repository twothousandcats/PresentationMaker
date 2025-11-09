import {
  createContext,
  type FC,
  type ReactNode,
  StrictMode,
  useEffect,
  useState,
} from 'react';
import { createRoot, type Root } from 'react-dom/client';
import './index.css';
import App from './components/App/App.tsx';
import {
  addPresentationChangeHandler,
  getPresentation,
} from './store/editor.ts';
import type { ThemeInterface } from './store/types/utility-interfaces.ts';
import type { Theme } from './store/types/utility-types.ts';
import { LOCAL_STORAGE_NAMES } from './store/utils/config.ts';

const container = document.getElementById('root')!;
const root: Root = createRoot(container);

export const ThemeContext = createContext<ThemeInterface>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(
    localStorage.getItem(LOCAL_STORAGE_NAMES.theme)
      ? (localStorage.getItem(LOCAL_STORAGE_NAMES.theme) as Theme)
      : 'light'
  );

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(LOCAL_STORAGE_NAMES.theme, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

function processRender() {
  root.render(
    <StrictMode>
      <ThemeProvider>
        <App {...getPresentation()} />
      </ThemeProvider>
    </StrictMode>
  );
}

addPresentationChangeHandler(processRender);
processRender();
