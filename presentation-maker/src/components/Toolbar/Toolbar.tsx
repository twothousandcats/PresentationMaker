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
  moveElementsDown,
  moveElementsToBottom,
  moveElementsToTop,
  moveElementsUp,
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
import {
  selectCurrentPresentation,
  selectHistory,
  selectUI,
} from '../../store/selectors/editorSelectors.ts';
import IconPlay from '../Icons/IconPlay.tsx';
import { PAGES_URL } from '../../store/utils/config.ts';
import { useNavigate } from 'react-router-dom';
import { usePresentationSave } from '../../store/hooks/usePresentationSave.ts';
import IconLayerOne from '../Icons/IconLayerOne.tsx';
import IconLayerUpper from '../Icons/IconLayerUpper.tsx';
import IconLayerDoubleUpper from '../Icons/IconLayerDoubleUpper.tsx';
import IconLayerLower from '../Icons/IconLayerLower.tsx';
import IconLayerDoubleLower from '../Icons/IconLayerDoubleLower.tsx';
import DropdownToolbar from '../DropdownMenu/DropdownToolbar.tsx';
import {LANGUAGES} from "../../store/utils/langs.ts";

export default function Toolbar() {
  const { id, title }: Presentation = useSelector(selectCurrentPresentation);
  const { selection }: UIState = useSelector(selectUI);
  const { past, future }: PresentationHistory = useSelector(selectHistory);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isExpanded, setExpanded] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [isAddBgDialogOpen, setIsAddBgDialogOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLLIElement>(null);

  const { save } = usePresentationSave();

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

  const toolbarButtons = [
    {
      icon: <IconPlay />,
      fn: async () => {
        if (id) {
          await save();
          navigate(`${PAGES_URL.presentationViewPage}${id}`);
        }
      },
      ariaLabel: LANGUAGES.ru.toolbarButtons.slideShow,
    },
    {
      icon: <IconDownload />,
      fn: () => console.log(LANGUAGES.ru.toolbarButtons.saveAsPdf),
      ariaLabel: LANGUAGES.ru.toolbarButtons.saveAsPdf,
    },
    {
      icon: <IconPlus />,
      fn: () => dispatch(addSlide({ newSlide: createDefaultSlide() })),
      ariaLabel: LANGUAGES.ru.toolbarButtons.addSlide,
    },
    {
      icon: <IconRemove />,
      fn: () =>
        dispatch(
          removeSlide({
            slideIdsToRemove: selection.selectedSlideIds,
          })
        ),
      ariaLabel: LANGUAGES.ru.toolbarButtons.removeSlide,
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
      ariaLabel: LANGUAGES.ru.toolbarButtons.addRectangle,
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
      ariaLabel: LANGUAGES.ru.toolbarButtons.addText,
      disabled: selection.selectedSlideIds.length === 0,
    },
    {
      icon: <IconDrop />,
      fn: () => setIsAddBgDialogOpen(true),
      ariaLabel: LANGUAGES.ru.toolbarButtons.changeBackground,
      disabled:
        selection.selectedSlideIds.length === 0 &&
        selection.selectedElementIds.length === 0,
    },
    {
      icon: <IconLayerOne />,
      fn: () => {},
      ariaLabel: LANGUAGES.ru.toolbarButtons.changeLayer,
      disabled: selection.selectedElementIds.length === 0,
      children: [
        {
          icon: <IconLayerDoubleUpper />,
          fn: () =>
              dispatch(
                  moveElementsToTop({
                    slideId: selection.selectedSlideIds[selection.selectedSlideIds.length - 1],
                    elementIds: selection.selectedElementIds,
                  })
              ),
          ariaLabel: LANGUAGES.ru.toolbarButtons.topLayer,
        },
        {
          icon: <IconLayerUpper />,
          fn: () =>
              dispatch(
                  moveElementsUp({
                    slideId: selection.selectedSlideIds[selection.selectedSlideIds.length - 1],
                    elementIds: selection.selectedElementIds,
                  })
              ),
          ariaLabel: LANGUAGES.ru.toolbarButtons.upperLayer,
        },
        {
          icon: <IconLayerLower />,
          fn: () =>
              dispatch(
                  moveElementsDown({
                    slideId: selection.selectedSlideIds[selection.selectedSlideIds.length - 1],
                    elementIds: selection.selectedElementIds,
                  })
              ),
          ariaLabel: LANGUAGES.ru.toolbarButtons.lowerLayer,
        },
        {
          icon: <IconLayerDoubleLower />,
          fn: () =>
              dispatch(
                  moveElementsToBottom({
                    slideId: selection.selectedSlideIds[selection.selectedSlideIds.length - 1],
                    elementIds: selection.selectedElementIds,
                  })
              ),
          ariaLabel: LANGUAGES.ru.toolbarButtons.bottomLayer,
        },
      ],
    },
    {
      icon: <IconUndo />,
      fn: () => {
        dispatch(undo());
      },
      ariaLabel: LANGUAGES.ru.toolbarButtons.undo,
      disabled: past.length === 0,
    },
    {
      icon: <IconRedo />,
      fn: () => {
        dispatch(redo());
      },
      ariaLabel: LANGUAGES.ru.toolbarButtons.redo,
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
          {toolbarButtons.map((btn, index) => {
            if (btn.children && btn.children.length > 0 && !btn.disabled) {
              return (
                <DropdownToolbar
                  key={index}
                  trigger={
                    <IconButton
                      icon={btn.icon}
                      onClickFn={() => {}}
                      ariaLabel={btn.ariaLabel}
                      disabled={btn.disabled}
                    />
                  }
                  items={btn.children.map((child) => ({
                    label: child.ariaLabel,
                    icon: child.icon,
                    onClick: child.fn,
                  }))}
                />
              );
            } else {
              return (
                <IconButton
                  key={index}
                  icon={btn.icon}
                  onClickFn={btn.fn}
                  ariaLabel={btn.ariaLabel}
                  disabled={btn.disabled}
                />
              );
            }
          })}
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
