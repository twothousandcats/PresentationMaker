import React, { useRef, useEffect, useState } from 'react';
import style from './TextElement.module.css';
import type { SlideElement } from '../../store/types/types.ts';
import { useDispatch } from 'react-redux';
import { changeTextElContent } from '../../store/slices/editorSlice.ts';

type TextElementProps = {
  element: SlideElement & { type: 'text' };
  slideId: string;
  isEditable?: boolean;
  scale: number;
  isActive?: boolean;
};

export const TextElement: React.FC<TextElementProps> = ({
  element,
  slideId,
  isEditable,
  scale,
  isActive,
}) => {
  const dispatch = useDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  // состояние редактирования
  useEffect(() => {
    if (isEditable && isActive) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [isEditable, isActive]);

  // Фокус на textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
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
    fontSize: `${(element.fontSize * scale).toFixed(2)}px`,
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
  };

  return (
    <div className={style.text}>
      <textarea
        ref={textareaRef}
        value={element.content}
        onChange={handleChange}
        onBlur={handleBlur}
        style={textStyle}
        className={style.textarea}
      />
    </div>
  );
};
