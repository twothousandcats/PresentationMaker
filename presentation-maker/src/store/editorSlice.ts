import type {
  Background,
  EditorMode,
  Position,
  Presentation,
  Size,
  Slide,
  SlideElement, TextElement,
} from './types/types.ts';
import { getRandomId } from './utils/functions.ts';
import { PRESENTATION_SIZE } from './utils/config.ts';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// TODO: убрать mocks перед сдачей проекта
const initialState: Presentation = {
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
};

/* const emptyInitialState: Presentation = {
  id: getRandomId(),
  title: '',
  slides: [],
  size: {
    width: PRESENTATION_SIZE.width,
    height: PRESENTATION_SIZE.height,
  },
  selection: {
    selectedSlideIds: [],
    selectedElementIds: [],
  },
  mode: { type: 'idle' },
}; */

function getSlide(
  slideId: string,
  state: Presentation,
) {
  return state.slides.find(slide => slide.id === slideId)
}

function getElement(
  elementId: string,
  slide: Slide,
) {
  return slide.elements.find(element => element.id === elementId)
}

const editorSlice = createSlice({
  name: 'editor',
  initialState: initialState,

  // Immer
  reducers: {
    renamePresentation: (
      state,
      action: PayloadAction<{
        newName: string;
      }>
    ) => {
      state.title = action.payload.newName;
    },

    addSlide: (
      state,
      action: PayloadAction<{
        newSlide: Slide;
      }>
    ) => {
      state.slides.push(action.payload.newSlide);
    },

    removeSlide: (
      state,
      action: PayloadAction<{
        slideIdsToRemove: string[];
      }>
    ) => {
      const { slideIdsToRemove } = action.payload;
      state.slides = state.slides.filter(
        (slide) => !slideIdsToRemove.includes(slide.id)
      );
      state.selection.selectedSlideIds =
        state.selection.selectedSlideIds.filter(
          (id) => !slideIdsToRemove.includes(id)
        );

      if (
        state.selection.selectedSlideIds.length === 0 &&
        state.slides.length > 0
      ) {
        state.selection.selectedSlideIds = [state.slides[0].id];
      }
    },

    moveSlides: (
      state,
      action: PayloadAction<{
        slideIds: string[];
        newIndex: number;
      }>
    ) => {
      const { slideIds, newIndex } = action.payload;
      // Убираем дубликаты и сохраняем порядок
      const uniqueSlideIds = Array.from(new Set(slideIds));

      // Находим текущие индексы перемещаемых слайдов
      const movedSlides: Slide[] = [];
      const remainingSlides: Slide[] = [];

      for (const slide of state.slides) {
        if (uniqueSlideIds.includes(slide.id)) {
          movedSlides.push(slide);
        } else {
          remainingSlides.push(slide);
        }
      }

      // Если ни один из слайдов не найден или newIndex не требует изменений
      if (movedSlides.length === 0) {
        return;
      }

      // Не выходим за 0 и максимальный индекс
      const clampedNewIndex = Math.max(
        0,
        Math.min(newIndex, remainingSlides.length)
      );

      state.slides = [
        ...remainingSlides.slice(0, clampedNewIndex),
        ...movedSlides,
        ...remainingSlides.slice(clampedNewIndex),
      ];
    },

    addElementToSlide: (
      state,
      action: PayloadAction<{
        slideId: string;
        newElement: SlideElement;
      }>
    ) => {
      const { slideId, newElement } = action.payload;
      const targetSlide = state.slides.find((slide) => slide.id === slideId);

      if (!targetSlide) {
        return;
      }

      targetSlide.elements.push(newElement);
    },

    removeElementsFromSlide: (
      state,
      action: PayloadAction<{
        slideId: string;
        elementIds: string[];
      }>
    ) => {
      const { slideId, elementIds } = action.payload;
      const targetSlide = state.slides.find((slide) => slide.id === slideId);
      if (!targetSlide) {
        return;
      }

      targetSlide.elements = targetSlide.elements.filter(
        (element) => !elementIds.includes(element.id)
      );
      state.selection.selectedElementIds =
        state.selection.selectedElementIds.filter(
          (id) => !elementIds.includes(id)
        );
    },

    changeElPosition: (
      state,
      action: PayloadAction<{
        slideId: string;
        elementId: string;
        newPosition: Position;
      }>
    ) => {
      const { slideId, elementId, newPosition } = action.payload;
      const slide = getSlide(slideId, state);
      if (!slide) {
        return;
      }
      const element = getElement(elementId, slide);
      if(!element) {
        return;
      }

      element.position = newPosition;
    },

    changeElSize: (
      state,
      action: PayloadAction<{
        slideId: string;
        elementId: string;
        newSize: Size;
      }>
    ) => {
      const { slideId, elementId, newSize } = action.payload;
      const slide = getSlide(slideId, state);
      if (!slide) {
        return;
      }
      const element = getElement(elementId, slide);
      if(!element) {
        return;
      }

      element.size = newSize;
    },

    changeTextElContent: (
      state,
      action: PayloadAction<{
        slideId: string;
        elementId: string;
        newContent: string;
      }>
    ) => {
      const { slideId, elementId, newContent } = action.payload;
      const slide = getSlide(slideId, state);
      if (!slide) {
        return;
      }
      const element = getElement(elementId, slide) as TextElement; // тайпгард
      if(!element) {
        return;
      }

      element.content = newContent;
    },

    changeFontFamily: (
      state,
      action: PayloadAction<{
        slideId: string;
        elementId: string;
        newFF: string;
      }>
    ) => {
      const { slideId, elementId, newFF } = action.payload;
      const slide = getSlide(slideId, state);
      if (!slide) {
        return;
      }
      const element = getElement(elementId, slide) as TextElement; // тайпгард
      if(!element) {
        return;
      }

      element.fontFamily = newFF;
    },

    changeElementBg: (
      state,
      action: PayloadAction<{
        slideId: string;
        elementId: string;
        newBg: Background;
      }>
    ) => {
      const { slideId, elementId, newBg } = action.payload;
      const slide = getSlide(slideId, state);
      if (!slide) {
        return;
      }
      const element = getElement(elementId, slide);
      if(!element) {
        return;
      }

      element.background = newBg;
    },

    changeSlideBg: (
      state,
      action: PayloadAction<{
        slideId: string;
        newBg: Background;
      }>
    ) => {
      const { slideId, newBg } = action.payload;
      const targetSlide = state.slides.find((slide) => slide.id === slideId);

      if (!targetSlide) {
        return;
      }

      targetSlide.background = newBg;
    },

    setSelectedSlides: (
      state,
      action: PayloadAction<{
        slideIds: string[];
      }>
    ) => {
      state.selection.selectedSlideIds = action.payload.slideIds;
    },

    setSelectedElements: (
      state,
      action: PayloadAction<{
        elementsIds: string[];
      }>
    ) => {
      state.selection.selectedElementIds = action.payload.elementsIds;
    },

    setEditorMode: (
      state,
      action: PayloadAction<{
        mode: EditorMode;
      }>
    ) => {
      state.mode = action.payload.mode;
    },

    clearSelection: (state) => {
      if (state.selection.selectedElementIds.length > 0) {
        state.selection.selectedElementIds = [];
      } else if (state.selection.selectedSlideIds.length > 0) {
        state.selection.selectedSlideIds = [];
      } else {
        return;
      }
    }
  },
});

export const {
  renamePresentation,
  addSlide,
  removeSlide,
  moveSlides,
  addElementToSlide,
  removeElementsFromSlide,
  changeElPosition,
  changeElSize,
  changeTextElContent,
  changeFontFamily,
  changeElementBg,
  changeSlideBg,
  setSelectedSlides,
  setSelectedElements,
  setEditorMode,
  clearSelection,
} = editorSlice.actions;

export default editorSlice.reducer;
