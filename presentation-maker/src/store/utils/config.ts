const AUTOSAVE_DELAY_MS: number = 5000;

const PRESENTATION_SIZE = {
  width: 1240,
  height: 720,
};

const DEFAULT_SLIDE_WIDTH = 240;

const SELECTORS = {
  portalRoot: 'portal-root',
};

const LOCAL_STORAGE_NAMES = {
  theme: 'app-theme',
};

const PAGES_URL = {
  editorPage: '/',
  loginPage: '/login/',
  collectionPage: '/collection/',
  presentationViewPage: '/view/',
}

const getPortal = () => {
  return document.getElementById(SELECTORS.portalRoot);
};

export {
  AUTOSAVE_DELAY_MS,
  DEFAULT_SLIDE_WIDTH,
  LOCAL_STORAGE_NAMES,
  PRESENTATION_SIZE,
  getPortal,
  PAGES_URL,
};
