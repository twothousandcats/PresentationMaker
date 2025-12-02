import type { EditorMode, UIState } from '../types/types.ts';

export function setSelectedElements(
  ui: UIState,
  elementsIds: string[]
): UIState {
  return {
    ...ui,
    selection: {
      ...ui.selection,
      selectedElementIds: elementsIds,
    },
  };
}

export function setEditorMode(ui: UIState, mode: EditorMode): UIState {
  return {
    ...ui,
    mode,
  };
}

export function setSelectedSlides(ui: UIState, slideIds: string[]): UIState {
  return {
    ...ui,
    selection: {
      ...ui.selection,
      selectedSlideIds: slideIds,
      selectedElementIds: [],
    },
  };
}

export function clearElementsSelection(ui: UIState): UIState {
  const newSelection = {
    ...ui.selection,
    selectedElementIds: [],
  };

  return {
    ...ui,
    selection: newSelection,
  };
}
