import { useState, useCallback } from 'react';
import type { Position, Selection, Slide } from '../types/types.ts';
import { changeElPosition } from '../editorSlice.ts';
import { useDispatch } from 'react-redux';

const calculateDelta = (clientPos: number, startMousePos: number) => {
  return clientPos - startMousePos;
};

export const useElementDND = (
  slide: Slide,
  selection: Selection,
  isEditable?: boolean
) => {
  const dispatch = useDispatch();
  const [dragOffsets, setDragOffsets] = useState<Record<string, Position>>({});

  const handleDragStart = useCallback(
    (clientX: number, clientY: number) => {
      if (!isEditable) {
        return;
      }

      const startPositions: Record<string, Position> = {};
      selection.selectedElementIds.forEach((id) => {
        const element = slide.elements.find((el) => el.id === id);
        if (element) {
          startPositions[id] = { ...element.position };
        }
      });

      const dragData = {
        startMouse: { x: clientX, y: clientY },
        startPositions,
      };

      const handleMouseMove = (event: MouseEvent) => {
        const deltaX = calculateDelta(event.clientX, dragData.startMouse.x);
        const deltaY = calculateDelta(event.clientY, dragData.startMouse.y);
        const newOffsets: Record<string, Position> = {};
        selection.selectedElementIds.forEach((id) => {
          newOffsets[id] = {
            x: deltaX,
            y: deltaY,
          };
        });
        setDragOffsets(newOffsets);
      };

      const handleMouseUp = (event: MouseEvent) => {
        const finalDeltaX = calculateDelta(
          event.clientX,
          dragData.startMouse.x
        );
        const finalDeltaY = calculateDelta(
          event.clientY,
          dragData.startMouse.y
        );
        selection.selectedElementIds.forEach((id) => {
          const startPosition = dragData.startPositions[id];
          if (!startPosition) {
            return;
          }

          const newPosition = {
            x: startPosition.x + finalDeltaX,
            y: startPosition.y + finalDeltaY,
          };
          dispatch(
            changeElPosition({
              slideId: slide.id,
              elementId: id,
              newPosition,
            })
          );
        });

        setDragOffsets({});
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [isEditable, selection.selectedElementIds, slide.elements, slide.id, dispatch]
  );

  return { dragOffsets, handleDragStart };
};
