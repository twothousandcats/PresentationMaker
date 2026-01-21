import React, { useRef, useEffect, useState } from 'react';
import style from './TextElement.module.css';
import type { SlideElement } from '../../store/types/types.ts';
import { useDispatch } from 'react-redux';
import { changeTextElContent } from '../../store/slices/editorSlice.ts';

type TextElementProps = {
  element: SlideElement & { type: 'text' };
  slideId: string;
  isEditable?: boolean;
};

export default function TextElement({
  element,
  slideId,
  isEditable,
}: TextElementProps) {
  const dispatch = useDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    if (isEditable) {
      setIsEditing(true);
    }
  };

  // Фокус на textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // размонтирование статусов
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditing) {
        setIsEditing(false);
        textareaRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = evt.target.value;
    dispatch(
      changeTextElContent({
        slideId,
        elementId: element.id,
        newContent,
      })
    );
  };

  const textStyle = {
    fontFamily: element.fontFamily ?? 'inherit',
    fontSize: `${element.fontSize}px`,
    fontWeight: element.fontWeight ?? 'normal',
    color: element.color ?? 'inherit',
    backgroundColor:
      element.background?.type === 'solid'
        ? element.background.color
        : 'transparent',
    ...(element.background?.type === 'image' &&
      element.background.data && {
        backgroundImage: `url(${element.background.data})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
      }),
    cursor: isEditing ? 'text' : 'default',

    // vendor
    border: 'none',
    outline: 'none',
    resize: 'none' as const,
    width: '100%',
    height: '100%',
    boxSizing: 'border-box' as const,
    overflow: 'hidden' as const,
    whiteSpace: 'pre-wrap' as const,
    wordWrap: 'break-word' as const,
    userSelect: 'none' as const,
  };

  return (
    <div className={style.text} onDoubleClick={handleDoubleClick}>
      <textarea
        ref={textareaRef}
        value={element.content}
        onChange={handleChange}
        onBlur={handleBlur}
        style={textStyle}
        className={style.textarea}
        readOnly={!isEditing}
        tabIndex={isEditing ? 0 : -1} // запрет фокуса
        onFocus={(e) => {
          if (!isEditing) {
            e.preventDefault();
            e.target.blur();
          }
        }}
      />
    </div>
  );
}
