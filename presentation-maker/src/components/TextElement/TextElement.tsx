import React, { useRef, useEffect } from 'react';
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
  const textRef = useRef<HTMLDivElement>(null);

  const handleTextChange = (evt: React.SyntheticEvent<HTMLDivElement>) => {
    const newContent = evt.currentTarget.innerHTML;
    dispatch(
      changeTextElContent({
        slideId,
        elementId: element.id,
        newContent,
      })
    );
  };

  useEffect(() => {
    if (isEditable && isActive && textRef.current) {
      textRef.current.focus();
    }
  }, [isEditable, isActive]);

  return (
    <div
      className={style.text}
      ref={textRef}
      contentEditable={isEditable}
      suppressContentEditableWarning={true}
      onBlur={handleTextChange}
      style={{
        fontFamily: element.fontFamily ?? 'inherit',
        fontSize: `${(element.fontSize * scale).toFixed(2)}px`,
        fontWeight: element.fontWeight ?? 'normal',
        color: element.color ?? 'inherit',
        backgroundColor:
          element.background?.type === 'solid'
            ? element.background.color
            : 'transparent',
        userSelect: !isEditable ? 'none' : 'auto',
        ...(element.background?.type === 'image' &&
          element.background.data && {
            backgroundImage: `url(${element.background.data})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          }),
        ...(element.background?.type === 'solid' &&
          element.background.color && {
            backgroundColor: element.background.color,
          }),
      }}
    >
      {element.content}
    </div>
  );
};
