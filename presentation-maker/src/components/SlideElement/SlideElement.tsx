import style from './SlideElement.module.css';
import type { Position, Size, SlideElement } from '../../store/types/types.ts';
import { concatClassNames } from '../../store/utils/functions.ts';
import * as React from 'react';
import { useSelectElements } from '../../store/hooks/useSelectElements.ts';
import type { ScreenStyle } from '../../store/types/utility-types.ts';
import { RectangleElement } from '../RectangleElement/RectangleElement.tsx';
import { TextElement } from '../TextElement/TextElement.tsx';

type ElementProps = {
  element: SlideElement;
  slideSize: Size;
  slideId: string;
  slideElements: SlideElement[];
  selectedElementsIds: string[];
  styleOverride: ScreenStyle;
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
  isEditable,
  isInteractive,
  isPlacing,
  isActive,
  onDragStart,
}: ElementProps) {
  const { handleSelectElement } = useSelectElements({
    elements: slideElements,
    selection: selectedElementsIds,
  });

  const handleDragStart = (evt: React.MouseEvent) => {
    if (!isActive || !isInteractive) return;
    evt.preventDefault();
    onDragStart?.(evt.clientX, evt.clientY);
  };

  const classNames = concatClassNames([
    style.element,
    !isEditable && style.element_disabled,
  ]);

  return (
    <div
      className={classNames}
      style={{
        ...styleOverride,
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
        <RectangleElement background={element.background} />
      ) : element.type === 'text' ? (
        <TextElement
          element={element}
          slideId={slideId}
          isEditable={isEditable}
          isActive={isActive}
        />
      ) : null}
    </div>
  );
}
