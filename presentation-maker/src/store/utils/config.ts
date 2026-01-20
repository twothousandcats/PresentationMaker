const AUTOSAVE_DELAY_MS: number = 5000;
const INFO_DELAY_MS: number = 4000;
const CONTROLS_TO_HIDE_DELAY_MS: number = 3000;

// 16:9
const PRESENTATION_SIZE = {
  width: 1600, // width: 1240,
  height: 900, // height: 720,
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

const STANDARD_FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Palatino',
  'Garamond',
  'Comic Sans MS',
  'Impact',
  'Lucida Sans Unicode',
  'Geneva',
  'sans-serif',
  'serif',
  'monospace',
];
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

const getPortal = () => {
  return document.getElementById(SELECTORS.portalRoot);
};

export {
  AUTOSAVE_DELAY_MS,
  INFO_DELAY_MS,
  CONTROLS_TO_HIDE_DELAY_MS,
  DEFAULT_SLIDE_WIDTH,
  LOCAL_STORAGE_NAMES,
  PRESENTATION_SIZE,
  PAGES_URL,
  STANDARD_FONTS,
  FONT_SIZES,
  getPortal,
};
