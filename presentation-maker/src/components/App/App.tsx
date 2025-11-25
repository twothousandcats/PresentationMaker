import AppStyle from './App.module.css';
import SlidesList from '../SlidesList/SlidesList.tsx';
import Toolbar from '../Toolbar/Toolbar.tsx';
import SlideEditor from '../SlideEditor/SlideEditor.tsx';
import {
  redo,
  removeElementsFromSlide,
  removeSlide,
  undo,
} from '../../store/slices/editorSlice.ts';
import { useEffect, useCallback } from 'react';
import { clearSelection } from '../../store/slices/editorSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store.ts';

export default function App() {
  const { selection } = useSelector(
    (state: RootState) => state.editor.present
  );
  const dispatch = useDispatch();

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        if (selection.selectedElementIds.length > 0) {
          dispatch(
            removeElementsFromSlide({
              slideId: selection.selectedSlideIds[0],
              elementIds: selection.selectedElementIds,
            })
          );
        } else if (selection.selectedSlideIds.length > 0) {
          dispatch(
            removeSlide({
              slideIdsToRemove: selection.selectedSlideIds,
            })
          );
        }
      } else if (event.key === 'Escape') {
        dispatch(clearSelection());
      } else
      if (
        (event.ctrlKey && event.key.toLowerCase() === 'z') ||
        (event.metaKey && event.key.toLowerCase() === 'z')
      ) {
        event.preventDefault();
        dispatch(undo());
      } else if (
        (event.ctrlKey && event.key.toLowerCase() === 'y') ||
        (event.metaKey && event.key.toLowerCase() === 'y')
      ) {
        event.preventDefault();
        dispatch(redo());
      }
    },
    [
      selection.selectedElementIds,
      selection.selectedSlideIds,
      dispatch
    ]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  return (
    <section className={AppStyle.presentation}>
      <Toolbar />
      <div className={AppStyle.presentation__container}>
        <SlidesList />
        <SlideEditor />
      </div>
    </section>
  );
}
