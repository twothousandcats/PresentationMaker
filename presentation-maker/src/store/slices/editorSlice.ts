import type {
  EditorMode,
  HistoryContext,
  Presentation,
  EditorState,
  HistoryEntry,
} from '../types/types.ts';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import * as pureActions from '../actions/pureEditorActions.ts';
import * as pureUiActions from '../actions/uiActions.ts';
import { createNewPresentation } from '../utils/functions.ts';

const MAX_HISTORY_STACK_SIZE = 50;

const initialPres = createNewPresentation();
const initialContext: HistoryContext = {
  affectedSlideIds: [initialPres.slides[0].id],
  affectedElementIds: [],
  scrollTargetSlideId: initialPres.slides[0].id,
};
const initialState: EditorState = {
  presentationHistory: {
    past: [],
    present: {
      presentation: initialPres,
      context: initialContext,
    },
    future: [],
  },
  ui: {
    selection: {
      selectedSlideIds: [initialPres.slides[0].id],
      selectedElementIds: [],
    },
    mode: { type: 'idle' },
  },
};

function createHistoryReducer<T>(
  actionCreator: (presentation: Presentation, payload: T) => HistoryEntry
) {
  return (state: EditorState, action: PayloadAction<T>) => {
    const currentEntry = state.presentationHistory.present;
    const result = actionCreator(currentEntry.presentation, action.payload);

    const newPast = [...state.presentationHistory.past, currentEntry];
    if (newPast.length > MAX_HISTORY_STACK_SIZE) {
      newPast.shift();
    }

    state.presentationHistory = {
      past: newPast,
      present: result,
      future: [],
    };

    // Восстанавливаем UI
    const { affectedSlideIds, affectedElementIds, scrollTargetSlideId } = result.context;
    if (scrollTargetSlideId) {
      state.ui.selection = {
        selectedSlideIds: [scrollTargetSlideId],
        selectedElementIds: [],
      };
    } else if (affectedSlideIds.length > 0 || affectedElementIds.length > 0) {
      state.ui.selection = {
        selectedSlideIds: [...affectedSlideIds],
        selectedElementIds: [...affectedElementIds],
      };
    }

    state.ui.lastAppliedContext = result.context;
  };
}

const editorSlice = createSlice({
  name: 'editor',
  initialState: initialState,

  // Immer
  reducers: {
    renamePresentation: createHistoryReducer(pureActions.renamePresentation),
    addSlide: createHistoryReducer(pureActions.addSlide),
    removeSlide: createHistoryReducer(pureActions.removeSlide),
    moveSlides: createHistoryReducer(pureActions.moveSlides),
    addElementToSlide: createHistoryReducer(pureActions.addElementToSlide),
    removeElementsFromSlide: createHistoryReducer(pureActions.removeElementsFromSlide),
    changeElPosition: createHistoryReducer(pureActions.changeElPosition),
    changeElSize: createHistoryReducer(pureActions.changeElSize),
    changeTextElContent: createHistoryReducer(pureActions.changeTextElContent),
    changeFontFamily: createHistoryReducer(pureActions.changeFontFamily),
    changeElementBg: createHistoryReducer(pureActions.changeElementBg),
    changeSlideBg: createHistoryReducer(pureActions.changeSlideBg),
    resizeElement: createHistoryReducer(pureActions.resizeElement),

    // UI only reducers
    setSelectedSlides: (
      state,
      action: PayloadAction<{
        slideIds: string[];
      }>
    ) => {
      state.ui = pureUiActions.setSelectedSlides(
        state.ui,
        action.payload.slideIds
      );
    },

    setSelectedElements: (
      state,
      action: PayloadAction<{
        elementsIds: string[];
      }>
    ) => {
      state.ui = state.ui = pureUiActions.setSelectedElements(
        state.ui,
        action.payload.elementsIds
      );
    },

    setEditorMode: (
      state,
      action: PayloadAction<{
        mode: EditorMode;
      }>
    ) => {
      state.ui = pureUiActions.setEditorMode(state.ui, action.payload.mode);
    },

    clearSelection: (state) => {
      state.ui = pureUiActions.clearElementsSelection(state.ui);
    },

    undo: (state) => {
      if (state.presentationHistory.past.length === 0) return;

      const prevEntry = state.presentationHistory.past.pop()!;
      const currentEntry = state.presentationHistory.present;

      state.presentationHistory.future.unshift(currentEntry);
      state.presentationHistory.present = prevEntry;
      console.log(state);

      // восстановление выделения, если контекст не пустой
      const { affectedSlideIds, affectedElementIds, scrollTargetSlideId } = currentEntry.context;
      console.log(scrollTargetSlideId);
      if (affectedSlideIds.length > 0 || affectedElementIds.length > 0) {
        state.ui.selection = {
          selectedSlideIds: [...affectedSlideIds],
          selectedElementIds: [...affectedElementIds],
        };
      }
      state.ui.lastAppliedContext = currentEntry.context;
    },

    redo: (state) => {
      if (state.presentationHistory.future.length === 0) return;

      const nextEntry = state.presentationHistory.future.shift()!;
      const currentEntry = state.presentationHistory.present;

      state.presentationHistory.past.push(currentEntry);
      state.presentationHistory.present = nextEntry;

      // восстановление выделения, если контекст не пустой
      const { affectedSlideIds, affectedElementIds, scrollTargetSlideId } = nextEntry.context;
      if (affectedSlideIds.length > 0 || affectedElementIds.length > 0) {
        state.ui.selection = {
          selectedSlideIds: [...affectedSlideIds],
          selectedElementIds: [...affectedElementIds],
        };
      }
      state.ui.lastAppliedContext = currentEntry.context;
    },

    loadPresentation: (state, action: PayloadAction<Presentation>) => {
      const pres = action.payload;
      const newContext: HistoryContext = {
        affectedSlideIds: pres.slides.map((s) => s.id),
        affectedElementIds: pres.slides.flatMap((s) =>
          s.elements.map((e) => e.id)
        ),
        scrollTargetSlideId: pres.slides[0]?.id,
      };

      state.presentationHistory = {
        past: [],
        present: { presentation: pres, context: newContext },
        future: [],
      };

      state.ui.selection = {
        selectedSlideIds: pres.slides.length ? [pres.slides[0].id] : [],
        selectedElementIds: [],
      };
      state.ui.lastAppliedContext = newContext;
    },

    markAsSaved: (state) => {
      const currentEntry = state.presentationHistory.present;
      const result = pureActions.markAsSaved(currentEntry.presentation);

      const newPast = [...state.presentationHistory.past, currentEntry];
      if (newPast.length > MAX_HISTORY_STACK_SIZE) newPast.shift();

      state.presentationHistory = {
        past: newPast,
        present: result,
        future: [],
      };
    },
  },
});

export const {
  loadPresentation,
  markAsSaved,
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
  resizeElement,
  setSelectedSlides,
  setSelectedElements,
  setEditorMode,
  clearSelection,
  undo,
  redo,
} = editorSlice.actions;

export default editorSlice.reducer;
