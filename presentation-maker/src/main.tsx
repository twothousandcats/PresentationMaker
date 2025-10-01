import {StrictMode} from 'react'
import {createRoot, type Root} from 'react-dom/client'
import './index.css'
import App from "./components/App/App.tsx";
import {addPresentationChangeHandler, getPresentation} from "./store/editor.ts";

const container = document.getElementById('root')!;
const root: Root = createRoot(container);

function processRender() {
    root.render(
        <StrictMode>
            <App {...getPresentation()} />
        </StrictMode>
    );
}

addPresentationChangeHandler(processRender);
processRender();