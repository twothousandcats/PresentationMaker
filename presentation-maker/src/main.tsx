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
import type { ThemeInterface } from './store/types/utility-interfaces.ts';
import type { Theme } from './store/types/utility-types.ts';
import { LOCAL_STORAGE_NAMES, PAGES_URL } from './store/utils/config.ts';
import { store } from './store/store.ts';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { AuthPage } from './pages/AuthPage/AuthPage.tsx';
import { CollectionPage } from './pages/CollectionPage.tsx';
import * as React from 'react';
import { isAuth } from './lib/authService.ts';
import App from './components/App/App.tsx';

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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuth();
      setIsAuthenticated(auth);
      setIsAuthChecked(true);
    };

    checkAuth();
  }, []);

  if (!isAuthChecked) {
    return <div> Loading... </div>; // TODO: создать прелоудер
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={PAGES_URL.loginPage} replace />
  );
};

const router = createBrowserRouter([
  { path: PAGES_URL.loginPage, element: <AuthPage /> },
  {
    path: PAGES_URL.collectionPage,
    element: (
      <ProtectedRoute>
        <CollectionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: PAGES_URL.editorPage,
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },

  { path: '*', element: <Navigate to={PAGES_URL.collectionPage} replace /> },
]);

const container = document.getElementById('root')!;
const root: Root = createRoot(container);

function processRender() {
  root.render(
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </StrictMode>
  );
}

processRender();
