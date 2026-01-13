import style from './SlideElement.module.css';
import type { Position, Size, SlideElement } from '../../store/types/types.ts';
import { concatClassNames } from '../../store/utils/functions.ts';
import { changeTextElContent } from '../../store/slices/editorSlice.ts';
import { type SyntheticEvent, useEffect, useRef } from 'react';
import * as React from 'react';
import { useSelectElements } from '../../store/hooks/useSelectElements.ts';
import { useDispatch } from 'react-redux';
import type { ScreenStyle } from '../../store/types/utility-types.ts';

type ElementProps = {
  element: SlideElement;
  slideSize: Size;
  slideId: string;
  slideElements: SlideElement[];
  selectedElementsIds: string[];
  styleOverride: ScreenStyle;
  scale: number;
  isEditable?: boolean;
  isInteractive?: boolean;
  isPlacing?: boolean;
  isActive?: boolean;
  onDragStart?: (clientX: number, clientY: number) => void;
  dragOffset?: Position;
  resizePreview?: { size: Size; position: Position } | null;
};

export default function SlideElement({
  element,
  slideId,
  slideElements,
  selectedElementsIds,
  styleOverride,
  scale,
  isEditable,
  isInteractive,
  isPlacing,
  isActive,
  onDragStart,
  dragOffset,
}: ElementProps) {
  const dispatch = useDispatch();

  const textRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (evt: React.MouseEvent) => {
    if (!isActive || !isInteractive) {
      return;
    }
    evt.preventDefault();

    onDragStart?.(evt.clientX, evt.clientY);
  };

  const bgColor =
    element.background?.type === 'solid' && element.background.color
      ? element.background.color
      : null;
  const bgImg =
    element.background?.type === 'image' && element.background.data
      ? element.background.data
      : null;
  /* const bgGradient = element.background && element.background.type === 'gradient' && element.background.gradient
        ? element.background.gradient
        : null */

  const { handleSelectElement } = useSelectElements({
    elements: slideElements,
    selection: selectedElementsIds,
  });

  const handleTextChange = (evt: SyntheticEvent<HTMLDivElement>) => {
    const newContent = evt.currentTarget.innerHTML;
    dispatch(
      changeTextElContent({
        slideId: slideId,
        elementId: element.id,
        newContent: newContent,
      })
    );
  };
  const classNames = concatClassNames([
    style.element,
    !isEditable && style.element_disabled,
  ]);

  useEffect(() => {
    if (isEditable && isActive && element.type === 'text' && textRef.current) {
      textRef.current?.focus();
    }
  }, [isEditable, isActive, element.type]);

  return (
    <div
      className={classNames}
      style={{
        ...styleOverride,
        // drag styles
        transform: dragOffset
          ? `translate(${dragOffset.x * scale}px, ${dragOffset.y * scale}px)`
          : 'none',
        cursor: isPlacing
          ? 'inherit'
          : isEditable && isActive
            ? 'move'
            : 'default',
      }}
      onClick={(event) => {
        if (isInteractive) {
          handleSelectElement(event, element);
        }
      }}
      onMouseDown={handleDragStart}
    >
      {element.type === 'rectangle' ? (
        <div
          className={style.image}
          style={{
            ...(element.background?.type === 'image' && {
              backgroundImage: `url(${element.background.data}`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%',
            }),
            ...(element.background?.type === 'solid' && {
              backgroundColor: element.background.color,
            }),
          }}
        />
      ) : (
        <div
          className={style.text}
          ref={textRef}
          contentEditable={isEditable}
          suppressContentEditableWarning={true}
          onBlur={handleTextChange}
          style={{
            fontFamily: `${element?.fontFamily}`,
            fontSize: `${(element?.fontSize * scale).toFixed(2)}px`,
            fontWeight: `${element?.fontWeight}`,
            color: `${element?.color}`,
            backgroundColor: `${bgColor}`,
            backgroundImage: `${bgImg}`,
            userSelect: `${!isEditable ? 'none' : 'auto'}`,
          }}
        >
          {element?.content}
        </div>
      )}
    </div>
  );
}
