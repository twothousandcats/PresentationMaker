import style from './Toolbar.module.css';
import type {
  Background,
  History,
  Presentation,
} from '../../store/types/types.ts';
import {
  type ChangeEvent,
  type KeyboardEvent,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import IconPlus from '../Icons/IconPlus.tsx';
import IconUndo from '../Icons/IconUndo.tsx';
import IconRedo from '../Icons/IconRedo.tsx';
import IconDownload from '../Icons/IconDownload.tsx';
import IconRemove from '../Icons/IconRemove.tsx';
import IconAddText from '../Icons/IconAddText.tsx';
import IconDrop from '../Icons/IconDrop.tsx';
import {
  addSlide,
  changeElementBg,
  changeSlideBg,
  markAsSaved,
  redo,
  removeSlide,
  renamePresentation,
  setEditorMode,
  undo,
} from '../../store/slices/editorSlice.ts';
import {
  createDefaultSlide,
  deselectInputAndBlur,
} from '../../store/utils/functions.ts';
import { AddBgDialog } from '../AddBgDialog/AddBgDialog.tsx';
import IconButton from '../IconButton/IconButton.tsx';
import IconRectangle from '../Icons/IconRectangle.tsx';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store.ts';
import { getCurrentUser } from '../../lib/authService.ts';
import { savePresentation } from '../../lib/presentationService.ts';

export default function Toolbar() {
  const { id, title, selection }: Presentation = useSelector(
    (state: RootState) => state.editor.present
  );
  const { past, present, future }: History = useSelector(
    (state: RootState) => state.editor
  );
  const dispatch = useDispatch();

  const [isExpanded, setExpanded] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [isAddBgDialogOpen, setIsAddBgDialogOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!isExpanded) {
      setDraftTitle(title);
    }
  }, [title, isExpanded]);

  const saveTitle = useCallback(() => {
    if (draftTitle !== title) {
      dispatch(renamePresentation({ newName: draftTitle }));
    }

    setExpanded(false);
  }, [draftTitle, title, dispatch]);

  const discardTitle = useCallback(() => {
    setDraftTitle(title);
    setExpanded(false);
  }, [title]);

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftTitle(event.target.value);
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        saveTitle();
        deselectInputAndBlur(inputRef);
      } else if (event.key === 'Escape') {
        discardTitle();
        deselectInputAndBlur(inputRef);
      }
    },
    [saveTitle, discardTitle]
  );

  const handleChangeBg = useCallback(
    (content: Background | null) => {
      if (!content) {
        return;
      }

      const { selectedSlideIds, selectedElementIds } = selection;
      const slideId = selectedSlideIds[0];
      const elementId = selectedElementIds[0];

      if (selectedElementIds.length > 0) {
        dispatch(
          changeElementBg({
            slideId,
            elementId,
            newBg: content,
          })
        );
      } else if (selectedSlideIds.length > 0) {
        dispatch(
          changeSlideBg({
            slideId,
            newBg: content,
          })
        );
      }

      setIsAddBgDialogOpen(false);
    },
    [dispatch, selection]
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        saveTitle();
        deselectInputAndBlur(inputRef);
      }
    },
    [saveTitle]
  );

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.select();
    }
  }, [isExpanded]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleSave = async () => {
    try {
      const user = await getCurrentUser();

      await savePresentation(present, user!.$id);
      if (present.isNew) {
        dispatch(markAsSaved());
        console.log('Флаг с новой презентации снят');
      }
      console.log('Презентация успешно сохранена в БД');
    } catch (error) {
      console.error('Ошибка сохранения презентации в БД: ', error);
    }
  };

  const toolbarButtons = [
    {
      icon: <IconDownload />,
      fn: async () => await handleSave(),
      ariaLabel: 'Сохранить презентацию',
    },
    {
      icon: <IconPlus />,
      fn: () => dispatch(addSlide({ newSlide: createDefaultSlide() })),
      ariaLabel: 'Добавить слайд',
    },
    {
      icon: <IconRemove />,
      fn: () =>
        dispatch(
          removeSlide({
            slideIdsToRemove: selection.selectedSlideIds,
          })
        ),
      ariaLabel: 'Удалить активный слайд',
      disabled: selection.selectedSlideIds.length === 0,
    },
    {
      icon: <IconRectangle />,
      fn: () =>
        dispatch(
          setEditorMode({
            mode: { type: 'placing', elementType: 'rectangle' },
          })
        ),
      ariaLabel: 'Добавить прямоугольник',
      disabled: selection.selectedSlideIds.length === 0,
    },
    {
      icon: <IconAddText />,
      fn: () =>
        dispatch(
          setEditorMode({
            mode: { type: 'placing', elementType: 'text' },
          })
        ),
      ariaLabel: 'Добавить текстовый элемент',
      disabled: selection.selectedSlideIds.length === 0,
    },
    {
      icon: <IconDrop />,
      fn: () => setIsAddBgDialogOpen(true),
      ariaLabel: 'Изменить фон',
      disabled:
        selection.selectedSlideIds.length === 0 &&
        selection.selectedElementIds.length === 0,
    },
    {
      icon: <IconUndo />,
      fn: () => {
        dispatch(undo());
      },
      ariaLabel: 'Отменить действие',
      disabled: past.length === 0,
    },
    {
      icon: <IconRedo />,
      fn: () => {
        dispatch(redo());
      },
      ariaLabel: 'Повторить действие',
      disabled: future.length === 0,
    },
  ];

  return (
    <>
      <div className={style.toolbar}>
        <ul className={style.toolbar__wrapper}>
          <li
            className={`${style.toolbar__item} ${style.toolbar__item_title} ${style.toolbar__item_title}`}
            ref={containerRef}
          >
            <input
              className={`${style.toolbar__input} ${isExpanded ? style.toolbar__input_expanded : ''}`}
              id={id}
              type="text"
              value={draftTitle}
              ref={inputRef}
              onClick={() => setExpanded(true)}
              onKeyDown={handleKeyDown}
              onChange={handleChangeTitle}
              readOnly={!isExpanded}
            />
          </li>
          {toolbarButtons.map((btn, index) => (
            <IconButton
              key={index}
              icon={btn.icon}
              onClickFn={btn.fn}
              ariaLabel={btn.ariaLabel}
              disabled={btn.disabled}
            />
          ))}
        </ul>
      </div>

      <AddBgDialog
        isOpen={isAddBgDialogOpen}
        onClose={() => setIsAddBgDialogOpen(false)}
        onAdd={handleChangeBg}
      />
    </>
  );
}
