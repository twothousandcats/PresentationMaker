import style from './TitleInput.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentPresentation } from '../../store/selectors/editorSelectors.ts';
import { type ChangeEvent,  type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { deselectInputAndBlur } from '../../store/utils/functions.ts';
import { renamePresentation } from '../../store/slices/editorSlice.ts';

export default function TitleInput() {
  const { title } = useSelector(selectCurrentPresentation);
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const containerRef = useRef<HTMLLIElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraftTitle(title);
  }, [title]);

  const saveTitle = useCallback(() => {
    const newTitle = draftTitle.trim() || 'Untitled';
    if (newTitle !== title) {
      dispatch(renamePresentation({ newName: newTitle }));
    }
    setIsExpanded(false);
  }, [draftTitle, title, dispatch]);

  const discardTitle = useCallback(() => {
    setDraftTitle(title);
    setIsExpanded(false);
  }, [title]);

  const handleClick = () => {
    setIsExpanded(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      saveTitle();
      deselectInputAndBlur(inputRef);
    } else if (event.key === 'Escape') {
      discardTitle();
      deselectInputAndBlur(inputRef);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDraftTitle(e.target.value);
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.select();
    }
  }, [isExpanded]);

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
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isExpanded, handleClickOutside]);

  return(
    <li
      ref={containerRef}
      className={`${style.toolbar__item} ${style.toolbar__item_title}`}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        className={`${style.toolbar__input} ${isExpanded ? style.toolbar__input_expanded : ''}`}
        type="text"
        value={draftTitle}
        readOnly={!isExpanded}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label="Presentation title"
      />
    </li>
  )
}
