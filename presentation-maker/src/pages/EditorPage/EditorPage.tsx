import style from './EditorPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import {
  clearSelection,
  loadPresentation,
  redo,
  removeElementsFromSlide,
  removeSlide,
  setEditorMode,
  undo,
} from '../../store/slices/editorSlice.ts';
import Toolbar from '../../components/Toolbar/Toolbar.tsx';
import SlidesList from '../../components/SlidesList/SlidesList.tsx';
import SlideEditor from '../../components/SlideEditor/SlideEditor.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { getPresentation } from '../../lib/presentationService.ts';
import { concatClassNames, createNewPresentation } from '../../store/utils/functions.ts';
import { PAGES_URL } from '../../store/utils/config.ts';
import { selectUI } from '../../store/selectors/editorSelectors.ts';
import { Loader } from '../../components/Loader/Loader.tsx';
import { usePresentationSave } from '../../store/hooks/usePresentationSave.ts';
import { LANGUAGES } from '../../store/utils/langs.ts';

export const EditorPage = () => {
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const { save, isSaving } = usePresentationSave();

  const { selection } = useSelector(selectUI);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        if (id) {
          const presentation = await getPresentation(id);
          dispatch(loadPresentation(presentation));
          console.log('Загрузка презентации успешна: ', presentation);
        } else {
          const newPresentation = createNewPresentation();
          dispatch(loadPresentation(newPresentation));
          console.log('Успешное создание презентации: ', newPresentation);
        }
      } catch (error) {
        console.error('Ошибка загрузки/создания презентации', error);
        navigate(PAGES_URL.collectionPage);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, dispatch, navigate]);

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
        dispatch(
          setEditorMode({
            mode: { type: 'idle' },
          })
        );
        dispatch(clearSelection());
      } else if (
        (event.ctrlKey || event.metaKey) &&
        event.code === 'KeyZ' &&
        !event.shiftKey
      ) {
        event.preventDefault();
        dispatch(undo());
      } else if ((event.ctrlKey || event.metaKey) && event.code === 'KeyY') {
        event.preventDefault();
        dispatch(redo());
      } else if ((event.ctrlKey || event.metaKey) && event.code === 'KeyS') {
        event.preventDefault();
        save();
      }
    },
    [selection.selectedElementIds, selection.selectedSlideIds, save, dispatch]
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
      {loading ? (
        <Loader />
      ) : (
        <div className={style.presentation__container}>
          <SlidesList />
          <SlideEditor />
        </div>
      )}
      <div className={concatClassNames([style.statusModal, isSaving && style.statusModalShown])}>{LANGUAGES.ru.toastSave}</div>
    </section>
  );
};
