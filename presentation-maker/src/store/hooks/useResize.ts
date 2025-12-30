import type { Slide, Position } from '../types/types.ts';
import { useCallback, useState } from 'react';
import { resizeElement } from '../slices/editorSlice.ts';
import type { ResizeItem, ResizePreview } from '../types/utility-types.ts';
import { useDispatch } from 'react-redux';

const MIN_SIZE = 10;

const computeFinalResize = (
  resizeItem: ResizeItem,
  deltaX: number,
  deltaY: number,
  initialWidth: number,
  initialHeight: number,
  initialX: number,
  initialY: number
): ResizePreview => {
  const affectsWidth = [
    'left',
    'right',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
  ].includes(resizeItem);
  const affectsHeight = [
    'top',
    'bottom',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
  ].includes(resizeItem);
  const affectsPositionX = ['left', 'topLeft', 'bottomLeft'].includes(
    resizeItem
  );
  const affectsPositionY = ['top', 'topLeft', 'topRight'].includes(resizeItem);

  let newWidth = initialWidth;
  let newHeight = initialHeight;

  if (affectsWidth) {
    if (['left', 'topLeft', 'bottomLeft'].includes(resizeItem)) {
      newWidth = initialWidth - deltaX;
    } else {
      newWidth = initialWidth + deltaX;
    }
  }

  if (affectsHeight) {
    if (['top', 'topLeft', 'topRight'].includes(resizeItem)) {
      newHeight = initialHeight - deltaY;
    } else {
      newHeight = initialHeight + deltaY;
    }
  }

  newWidth = Math.max(MIN_SIZE, newWidth);
  newHeight = Math.max(MIN_SIZE, newHeight);

  let newX = initialX;
  let newY = initialY;

  if (affectsPositionX) {
    newX = initialX + (initialWidth - newWidth);
  }

  if (affectsPositionY) {
    newY = initialY + (initialHeight - newHeight);
  }

  return {
    size: { width: newWidth, height: newHeight },
    position: { x: newX, y: newY },
  };
};

export const useResize = (
  slide: Slide,
  isEditable?: boolean,
  screenToLogical?: (screenX: number, screenY: number) => Position
) => {
  const dispatch = useDispatch();
  const [resizePreview, setResizePreview] = useState<Record<
    string,
    ResizePreview
  > | null>(null);

  const startResizing = useCallback(
    (
      elementId: string,
      resizeItem: ResizeItem,
      clientX: number,
      clientY: number
    ) => {
      if (!isEditable) {
        return;
      }

      const element = slide.elements.find((el) => el.id === elementId);
      if (!element) {
        return;
      }

      // Преобразуем
      const logicalStart = screenToLogical?.(clientX, clientY) ?? { x: clientX, y: clientY };
      const initialData = {
        width: element.size.width,
        height: element.size.height,
        x: element.position.x,
        y: element.position.y,
      };

      const handleMouseMove = (event: MouseEvent) => {
        event.preventDefault(); // с изображением были баги
        const logicalCurrent = screenToLogical?.(event.clientX, event.clientY) ?? {
          x: event.clientX,
          y: event.clientY,
        };
        const delta: Position = {
          x: logicalCurrent.x - logicalStart.x,
          y: logicalCurrent.y - logicalStart.y,
        };

        const preview = computeFinalResize(
          resizeItem,
          delta.x,
          delta.y,
          initialData.width,
          initialData.height,
          initialData.x,
          initialData.y
        );

        setResizePreview({ [elementId]: preview });
      };

      const handleMouseUp = (event: MouseEvent) => {
        setResizePreview(null);
        const logicalFinal = screenToLogical?.(event.clientX, event.clientY) ?? {
          x: event.clientX,
          y: event.clientY,
        };
        const finalDelta = {
          x: logicalFinal.x - logicalStart.x,
          y: logicalFinal.y - logicalStart.y,
        };

        const finalPreview = computeFinalResize(
          resizeItem,
          finalDelta.x,
          finalDelta.y,
          initialData.width,
          initialData.height,
          initialData.x,
          initialData.y
        );

        dispatch(
          resizeElement({
            slideId: slide.id,
            elementId,
            newSize: finalPreview.size,
            newPosition: finalPreview.position,
          })
        );

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [isEditable, slide.elements, slide.id, screenToLogical, dispatch]
  );

  return { startResizing, resizePreview };
};
