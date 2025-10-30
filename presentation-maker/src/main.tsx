import {createContext, type FC, type ReactNode, StrictMode, useState} from 'react'
import {createRoot, type Root} from 'react-dom/client'
import './index.css'
import App from "./components/App/App.tsx";
import {addPresentationChangeHandler, getPresentation} from "./store/editor.ts";
import type {ThemeInterface} from "./store/types/utility-interfaces.ts";
import type {Theme} from "./store/types/utility-types.ts";

const container = document.getElementById('root')!;
const root: Root = createRoot(container);

export const ThemeContext = createContext<ThemeInterface | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({children}) => {
    const [theme, setTheme] = useState<Theme>('light');

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}


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