import type { RootState } from '../store.ts';

export const selectHistory = (state: RootState) =>
  state.editor.presentationHistory;

export const selectCurrentPresentation = (state: RootState) =>
  state.editor.presentationHistory.present.presentation;

export const selectUI = (state: RootState) => state.editor.ui;

export const selectLastAppliedContext = (state: RootState) =>
  state.editor.ui.lastAppliedContext;
