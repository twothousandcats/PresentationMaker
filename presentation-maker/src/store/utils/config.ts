const DEFAULT_SLIDE_WIDTH = 240;

const SELECTORS = {
    portalRoot: 'portal-root',
};

const LOCAL_STORAGE_NAMES = {
    theme: 'app-theme',
}

const getPortal = () => {
    return document.getElementById(SELECTORS.portalRoot);
}

export {
    DEFAULT_SLIDE_WIDTH,
    LOCAL_STORAGE_NAMES,
    getPortal
}