import style from './EditorPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store.ts';
import { useCallback, useEffect } from 'react';
import {
  clearSelection,
  redo,
  removeElementsFromSlide,
  removeSlide,
  undo,
} from '../../store/slices/editorSlice.ts';
import Toolbar from '../../components/Toolbar/Toolbar.tsx';
import SlidesList from '../../components/SlidesList/SlidesList.tsx';
import SlideEditor from '../../components/SlideEditor/SlideEditor.tsx';


export const EditorPage = () => {
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
    <section className={style.presentation}>
      <Toolbar />
      <div className={style.presentation__container}>
        <SlidesList />
        <SlideEditor />
      </div>
    </section>
  );
}