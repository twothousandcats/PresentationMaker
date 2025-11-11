import style from './Toolbar.module.css';
import type { Background, Selection } from '../../store/types/types.ts';
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
  removeSlide,
  renamePresentation,
  setEditorMode,
} from '../../store/editorSlice.ts';
import { createDefaultSlide } from '../../store/utils/functions.ts';
import { AddBgDialog } from '../AddBgDialog/AddBgDialog.tsx';
import IconButton from '../IconButton/IconButton.tsx';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher.tsx';
import IconRectangle from '../Icons/IconRectangle.tsx';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store.ts';

interface ToolbarProps {
  id: string;
  title: string;
  selection: Selection;
}

export default function Toolbar() {
  const {
    id,
    title,
    selection,
  }: ToolbarProps = useSelector((state: RootState) => state.editor);
  const dispatch = useDispatch();

  const [isExpanded, setExpanded] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isAddBgDialogOpen, setIsAddBgDialogOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLLIElement>(null);

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

  const handleTitleChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const newName = evt.target.value;
      setNewTitle(newName);
      dispatch(renamePresentation({ newName }));
    },
    [dispatch]
  );

  const handleKeyDown = useCallback(
    (evt: KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === 'Enter') {
        setExpanded(false);
        inputRef.current?.blur();
      } else if (evt.key === 'Escape') {
        setNewTitle(title);
        setExpanded(false);
        inputRef.current?.blur();
      }
    },
    [title]
  );

  const handleClickOutside = useCallback((evt: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(evt.target as Node)
    ) {
      setExpanded(false);
    }
  }, []);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.select();
    }
  }, [isExpanded]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const toolbarButtons = [
    {
      icon: <IconDownload />,
      fn: () => console.log('Сохранить как'),
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
        dispatch(setEditorMode({
          mode: { type: 'placing', elementType: 'text' },
        })),
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
      fn: () => console.log('undo'),
      ariaLabel: 'Отменить действие',
    },
    {
      icon: <IconRedo />,
      fn: () => console.log('redo'),
      ariaLabel: 'Повторить действие',
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
              value={newTitle}
              ref={inputRef}
              onClick={() => setExpanded(true)}
              onKeyDown={handleKeyDown}
              onChange={handleTitleChange}
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
        <ThemeSwitcher />
      </div>

      <AddBgDialog
        isOpen={isAddBgDialogOpen}
        onClose={() => setIsAddBgDialogOpen(false)}
        onAdd={handleChangeBg}
      />
    </>
  );
}
