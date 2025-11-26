import style from './EditorPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  clearSelection,
  redo,
  removeElementsFromSlide,
  removeSlide,
  setLastSavedHash,
  undo,
  setPresentationId,
} from '../../store/slices/editorSlice.ts';
import Toolbar from '../../components/Toolbar/Toolbar.tsx';
import SlidesList from '../../components/SlidesList/SlidesList.tsx';
import SlideEditor from '../../components/SlideEditor/SlideEditor.tsx';
import { getCurrentUser } from '../../lib/authService.ts';
import { hashPresentation } from '../../lib/utils.ts';
import { savePresentation } from '../../lib/presentationService.ts';
import { autoSaveDelayMS } from '../../store/utils/config.ts';

export const EditorPage = () => {
  const selection = useSelector(
    (state: RootState) => state.editor.present.selection
  );
  const lastSavedHash = useSelector(
    (state: RootState) => state.editor.lastSavedHash
  );
  const presentation = useSelector((state: RootState) => state.editor.present);

  const dispatch = useDispatch();
  const [user, setUser] = useState<{ $id: string } | null>(null);
  const autoSaveTimerRef = useRef<number | null>(null);
  const isSavingRef = useRef(false);

  // определяем пользователя
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      console.log('Текущий пользователь: ', currentUser);
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  // хэш текущего состояния
  const currentHash = hashPresentation(presentation);
  // были ли изменения
  const hasUnsavedChanges = useCallback((): boolean => {
    return lastSavedHash !== currentHash;
  },[currentHash, lastSavedHash]);

  const autoSave = useCallback(async () => {
    if (!user || isSavingRef.current || !hasUnsavedChanges()) {
      return;
    }

    isSavingRef.current = true;
    try {
      const savedDoc = await savePresentation(presentation, user.$id);
      if (!presentation.id) {
        dispatch(setPresentationId(savedDoc.$id));
      }

      dispatch(setLastSavedHash(currentHash));
      console.log('Удачное сохранение! Id: ', savedDoc);
    } catch (error) {
      console.error('Неудачное сохранение: ', error);
    } finally {
      isSavingRef.current = false;
    }
  }, [user, presentation, hasUnsavedChanges, currentHash, dispatch]);

  useEffect(() => {
    if (!user) {
      return;
    }

    autoSaveTimerRef.current = setInterval(() => {
      autoSave();
    }, autoSaveDelayMS);

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [user, autoSave]);

  // сохраняем при размонтировании
  useEffect(() => {
    return () => {
      if(hasUnsavedChanges()) {
        autoSave();
      }
    }
  }, [autoSave]);

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
      } else if (
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
    [selection.selectedElementIds, selection.selectedSlideIds, dispatch]
  );

  // const handleSave = async () => {
  //   await autoSave();
  // };

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
};
