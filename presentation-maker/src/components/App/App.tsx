import AppStyle from './App.module.css';
import SlidesList from '../SlidesList/SlidesList.tsx';
import type { Presentation } from '../../store/types/types.ts';
import Toolbar from '../Toolbar/Toolbar.tsx';
import SlideEditor from '../SlideEditor/SlideEditor.tsx';
import {
  removeElementsFromSlide,
  removeSlide,
} from '../../store/editorSlice.ts';
import { useEffect, useCallback } from 'react';
import { clearSelection } from '../../store/editorSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store.ts';

export default function App() {
  const { selection }: Presentation = useSelector(
    (state: RootState) => state.editor
  );
  const dispatch = useDispatch();

  const handleDelete = useCallback(
    (evt: KeyboardEvent) => {
      const target = evt.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (evt.key === 'Backspace' || evt.key === 'Delete') {
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
      } else if (evt.key === 'Escape') {
        dispatch(clearSelection());
      }
    },
    [selection.selectedElementIds, selection.selectedSlideIds, dispatch]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleDelete as EventListener);
    return () => {
      document.removeEventListener('keydown', handleDelete as EventListener);
    };
  }, [handleDelete]);

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
