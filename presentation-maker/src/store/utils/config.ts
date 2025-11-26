import { getRandomId } from './functions.ts';
import type { Presentation } from '../types/types.ts';

const autoSaveDelayMS: number = 10000;

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
}

const mockPresentation: Presentation = {
  id: getRandomId(),
  title: 'new presentation',
  slides: [
    {
      id: getRandomId(),
      background: {
        type: 'solid',
        color: '#000',
      },
      elements: [
        {
          id: getRandomId(),
          position: {
            x: 400,
            y: 400,
          },
          size: {
            width: 400,
            height: 200,
          },
          type: 'text',
          content: 'first slide',
          fontFamily: 'Arial',
          fontSize: 14,
          fontWeight: 600,
          color: '#fc3fc3',
          background: {
            type: 'solid',
            color: '#f5f5dc',
          },
        },
      ],
    },
    {
      id: getRandomId(),
      background: {
        type: 'solid',
        color: '#fff',
      },
      elements: [
        {
          id: getRandomId(),
          position: {
            x: 0,
            y: 0,
          },
          size: {
            width: 100,
            height: 100,
          },
          type: 'text',
          content: 'Slide title',
          fontFamily: 'Arial',
          fontSize: 14,
          fontWeight: 400,
          color: '#000',
          background: {
            type: 'solid',
            color: '#f5f5dc',
          },
        },
        {
          id: getRandomId(),
          position: {
            x: 100,
            y: 100,
          },
          size: {
            width: 200,
            height: 200,
          },
          type: 'rectangle',
          background: {
            type: 'image',
            data: 'https://cf.youtravel.me/tr:w-1500/upload/tours/36765/media/a5d/j1t3o122iitxam7xknbcmi2f1uw5q586.jpg',
          },
        },
      ],
    },
    {
      id: getRandomId(),
      background: {
        type: 'image',
        data: 'https://hdpic.club/photo/uploads/posts/2023-03/thumbs/1679371066_hdpic-club-p-nissan-skailain-37.jpg',
      },
      elements: [],
    },
    {
      id: getRandomId(),
      background: {
        type: 'image',
        data: 'https://allbasketball.org/uploads/posts/2024-08/1722713229_qxxlefycdedjrsjdihmj.jpg',
      },
      elements: [],
    },
  ],
  size: {
    width: PRESENTATION_SIZE.width,
    height: PRESENTATION_SIZE.height,
  },
  selection: {
    selectedSlideIds: [],
    selectedElementIds: [],
  },
  mode: { type: 'idle' },
  isNew: false,
};

const getPortal = () => {
  return document.getElementById(SELECTORS.portalRoot);
};

export {
  autoSaveDelayMS,
  DEFAULT_SLIDE_WIDTH,
  LOCAL_STORAGE_NAMES,
  PRESENTATION_SIZE,
  getPortal,
  PAGES_URL,
  mockPresentation,
};
