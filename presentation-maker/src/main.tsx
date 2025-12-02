import {
  createContext,
  type FC,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import { createRoot, type Root } from 'react-dom/client';
import './index.css';
import type { ThemeInterface } from './store/types/utility-interfaces.ts';
import type { Theme } from './store/types/utility-types.ts';
import { LOCAL_STORAGE_NAMES, PAGES_URL } from './store/utils/config.ts';
import { store } from './store/store.ts';
import { Provider } from 'react-redux';
import { NotFound } from './pages/NotFound/NotFound.tsx';
import { CollectionPage } from './pages/CollectionPage/CollectionPage.tsx';
import { ProtectedLayout } from './components/ProtectedLayout/ProtectedLayout.tsx';
import { AuthPage } from './pages/AuthPage/AuthPage.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppRoot } from './components/AppRoot/AppRoot.tsx';
import { EditorPage } from './pages/EditorPage/EditorPage.tsx';
import { GuestOnlyLayout } from './components/GuestOnlyLayout/GuestOnlyLayout.tsx';

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

const router = createBrowserRouter([
  {
    element: <GuestOnlyLayout />,
    children: [{ path: PAGES_URL.loginPage, element: <AuthPage /> }],
  },
  {
    element: <ProtectedLayout />,
    children: [
      { path: PAGES_URL.collectionPage, element: <CollectionPage /> },
      { path: PAGES_URL.editorPage, element: <EditorPage /> }, // new
      { path: `${PAGES_URL.editorPage}/:id`, element: <EditorPage /> }, // exist
    ],
  },
  { path: '*', element: <NotFound /> },
]);

const container = document.getElementById('root')!;
const root: Root = createRoot(container);

function processRender() {
  root.render(
    <Provider store={store}>
      <ThemeProvider>
        <AppRoot>
          <RouterProvider router={router} />
        </AppRoot>
      </ThemeProvider>
    </Provider>
  );
}

processRender();
