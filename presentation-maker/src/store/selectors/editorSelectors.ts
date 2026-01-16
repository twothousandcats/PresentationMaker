import type { RootState } from '../store.ts';
import { createSelector } from '@reduxjs/toolkit';

export const selectHistory = (state: RootState) =>
  state.editor.presentationHistory;

export const selectCurrentPresentation = (state: RootState) =>
  state.editor.presentationHistory.present.presentation;

export const selectUI = (state: RootState) => state.editor.ui;

export const selectLastAppliedContext = (state: RootState) =>
  state.editor.ui.lastAppliedContext;

export const selectCurrentSlideElements = createSelector(
  [selectCurrentPresentation, selectUI],
  (presentation, ui) => {
    const currentSlideId = ui.selection.selectedSlideIds.at(-1);
    const slide = presentation.slides.find(
      (slide) => slide.id === currentSlideId
    );
    return slide?.elements || [];
  }
);
