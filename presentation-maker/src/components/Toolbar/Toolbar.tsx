import style from './Toolbar.module.css';
import type {
  Background,
  Presentation,
  PresentationHistory,
  UIState,
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
import { getCurrentUser } from '../../lib/authService.ts';
import { savePresentation } from '../../lib/presentationService.ts';
import {
  selectCurrentPresentation,
  selectHistory,
  selectUI,
} from '../../store/selectors/editorSelectors.ts';
import { AUTOSAVE_DELAY_MS } from '../../store/utils/config.ts';

export default function Toolbar() {
  const { id, title }: Presentation = useSelector(selectCurrentPresentation);
  const { selection }: UIState = useSelector(selectUI);
  const { past, future }: PresentationHistory = useSelector(selectHistory);
  const presentation = useSelector(selectCurrentPresentation);
  const dispatch = useDispatch();

  const [lastSaveLength, setLastSaveLength] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const presentationRef = useRef(presentation);
  const pastLengthRef = useRef(past.length);
  const lastSaveLengthRef = useRef(lastSaveLength);

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

  useEffect(() => {
    presentationRef.current = presentation;
    pastLengthRef.current = past.length;
    lastSaveLengthRef.current = lastSaveLength;
  });

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const currentPresentation = presentationRef.current;
      const currentPastLength = pastLengthRef.current;
      const currentLastSaveLength = lastSaveLengthRef.current;

      if (currentPastLength === currentLastSaveLength) {
        return;
      }

      try {
        const user = await getCurrentUser();
        const currentUser = user?.$id;
        if (!currentUser) {
          return;
        }

        await savePresentation(currentPresentation, currentUser);
        if (presentation.isNew) {
          dispatch(markAsSaved());
        }
        setLastSaveLength(currentPastLength);
      } catch (error) {
        console.error('Ошибка автосохранения:', error);
      }
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  });

  const toolbarButtons = [
    {
      icon: <IconDownload />,
      fn: () => console.log('Сохранить презентацию в pdf'),
      ariaLabel: 'Сохранить презентацию в pdf',
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
