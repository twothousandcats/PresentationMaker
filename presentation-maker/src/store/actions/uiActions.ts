import type { EditorMode, UIState } from '../types/types.ts';

export function setSelectedSlides(ui: UIState, slideIds: string[]): UIState {
  return {
    ...ui,
    selection: {
      ...ui.selection,
      selectedSlideIds: slideIds,
    },
  };
}

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

export function clearSelection(ui: UIState): UIState {
  if (ui.selection.selectedElementIds.length > 0) {
    return {
      ...ui,
      selection: {
        ...ui.selection,
        selectedElementIds: [],
      },
    };
  } else if (
    ui.selection.selectedElementIds.length === 0 &&
    ui.selection.selectedSlideIds.length > 0
  ) {
    return {
      ...ui,
      selection: {
        ...ui.selection,
        selectedSlideIds: [],
      },
    };
  } else {
    return ui;
  }
}
