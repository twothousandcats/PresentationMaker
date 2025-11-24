import type {
  Background,
  EditorMode,
  Position,
  Presentation,
  Size,
  Slide,
  SlideElement,
} from '../types/types.ts';
import { mockPresentation } from '../utils/config.ts';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import * as pureActions from '../actions/pureEditorActions.ts';

const MAX_HISTORY_STACK_SIZE = 50;
type HistoryState = {
  past: Presentation[];
  present: Presentation;
  future: Presentation[];
};

const initialState: HistoryState = {
  past: [],
  present: mockPresentation,
  future: [],
};

const editorSlice = createSlice({
  name: 'editor',
  initialState: initialState, // TODO: заменить mocks перед сдачей проекта

  // Immer
  reducers: {
    renamePresentation: (
      state,
      action: PayloadAction<{
        newName: string;
      }>
    ) => {
      const newPast = [...state.past, state.present];
      if (newPast.length > MAX_HISTORY_STACK_SIZE) {
        newPast.shift();
      }

      return {
        past: newPast,
        present: pureActions.renamePresentation(state.present, action.payload),
        future: [],
      };
    },

    addSlide: (
      state,
      action: PayloadAction<{
        newSlide: Slide;
      }>
    ) => {
      const newPast = [...state.past, state.present];
      checkPastOverflow(newPast);

      return {
        past: newPast,
        present: pureActions.addSlide(state.present, action.payload),
        future: [],
      };
    },

    removeSlide: (
      state,
      action: PayloadAction<{
        slideIdsToRemove: string[];
      }>
    ) => {
      const newPast = [...state.past, state.present];
      checkPastOverflow(newPast);

      return {
        past: newPast,
        present: pureActions.removeSlide(state.present, action.payload),
        future: [],
      };
    },

    moveSlides: (
      state,
      action: PayloadAction<{
        slideIds: string[];
        newIndex: number;
      }>
    ) => {
      const newPast = [...state.past, state.present];
      checkPastOverflow(newPast);

      return {
        past: newPast,
        present: pureActions.moveSlides(state.present, action.payload),
        future: [],
      };
    },

    addElementToSlide: (
      state,
      action: PayloadAction<{
        slideId: string;
        newElement: SlideElement;
      }>
    ) => {
      const newPast = [...state.past, state.present];
      checkPastOverflow(newPast);

      return {
        past: newPast,
        present: pureActions.addElementToSlide(state.present, action.payload),
        future: [],
      };
    },

    removeElementsFromSlide: (
      state,
      action: PayloadAction<{
        slideId: string;
        elementIds: string[];
      }>
    ) => {
      const newPast = [...state.past, state.present];
      checkPastOverflow(newPast);

      return {
        past: newPast,
        present: pureActions.removeElementsFromSlide(
          state.present,
          action.payload
        ),
        future: [],
      };
    },

    changeElPosition: (
      state,
      action: PayloadAction<{
        slideId: string;
        elementId: string;
        newPosition: Position;
      }>
    ) => {
      const newPast = [...state.past, state.present];
      checkPastOverflow(newPast);

      return {
        past: newPast,
        present: pureActions.changeElPosition(state.present, action.payload),
        future: [],
      };
    },

    changeElSize: (
      state,
      action: PayloadAction<{
        slideId: string;
        elementId: string;
        newSize: Size;
      }>
    ) => {
      const newPast = [...state.past, state.present];
      checkPastOverflow(newPast);

      return {
        past: newPast,
        present: pureActions.changeElSize(state.present, action.payload),
        future: [],
      };
    },

    changeTextElContent: (
      state,
      action: PayloadAction<{
        slideId: string;
        elementId: string;
        newContent: string;
      }>
    ) => {
      const newPast = [...state.past, state.present];
      checkPastOverflow(newPast);

      return {
        past: newPast,
        present: pureActions.changeTextElContent(state.present, action.payload),
        future: [],
      };
    },

    changeFontFamily: (
      state,
      action: PayloadAction<{
        slideId: string;
        elementId: string;
        newFF: string;
      }>
    ) => {
      const newPast = [...state.past, state.present];
      checkPastOverflow(newPast);

      return {
        past: newPast,
        present: pureActions.changeFontFamily(state.present, action.payload),
        future: [],
      };
    },

    changeElementBg: (
      state,
      action: PayloadAction<{
        slideId: string;
        elementId: string;
        newBg: Background;
      }>
    ) => {
      const newPast = [...state.past, state.present];
      checkPastOverflow(newPast);

      return {
        past: newPast,
        present: pureActions.changeElementBg(state.present, action.payload),
        future: [],
      };
    },

    changeSlideBg: (
      state,
      action: PayloadAction<{
        slideId: string;
        newBg: Background;
      }>
    ) => {
      const newPast = [...state.past, state.present];
      checkPastOverflow(newPast);

      return {
        past: newPast,
        present: pureActions.changeSlideBg(state.present, action.payload),
        future: [],
      };
    },

    // UI only reducers
    setSelectedSlides: (
      state,
      action: PayloadAction<{
        slideIds: string[];
      }>
    ) => {
      return {
        ...state,
        present: pureActions.setSelectedSlides(state.present, action.payload)
      }
    },

    setSelectedElements: (
      state,
      action: PayloadAction<{
        elementsIds: string[];
      }>
    ) => {
      return {
        ...state,
        present: pureActions.setSelectedElements(state.present, action.payload)
      }
    },

    setEditorMode: (
      state,
      action: PayloadAction<{
        mode: EditorMode;
      }>
    ) => {
      return {
        ...state,
        present: pureActions.setEditorMode(state.present, action.payload)
      }
    },

    clearSelection: (state) => {
      return {
        ...state,
        present: pureActions.clearSelection(state.present),
      }
    },

    undo: (state) => {
      if (!state.past.length) {
        return;
      }

      const previousState = state.past.pop()!;
      state.future.unshift(state.present);
      state.present = previousState;

      if (state.future.length > MAX_HISTORY_STACK_SIZE) {
        state.future.length = MAX_HISTORY_STACK_SIZE;
      }
    },
    redo: (state) => {
      if (!state.future.length) {
        return;
      }

      const nextState = state.future.shift()!;
      state.past.push(state.present);
      state.present = nextState;

      if (state.past.length > MAX_HISTORY_STACK_SIZE) {
        state.past.shift();
      }
    },
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
