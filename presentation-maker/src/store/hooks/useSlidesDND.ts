import * as React from 'react';
import { useCallback, useRef } from 'react';
import { dispatch } from '../editor.ts';
import { moveSlides } from '../functions/functions.ts';
import type { Slide } from '../types/types.ts';

interface SlidesDNDProps {
  slides: Slide[];
  selectedSlideIds: string[];
}

export const useSlidesDND = ({ slides, selectedSlideIds }: SlidesDNDProps) => {
  const draggedSlideIdsRef = useRef<string[]>([]);
  const dragTargetIdRef = useRef<string | null>(null);
  const insertAfterRef = useRef<boolean>(false);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent, slideId: string) => {
      if (event.button !== 0) {
        return;
      }

      draggedSlideIdsRef.current = selectedSlideIds.includes(slideId)
        ? [...selectedSlideIds]
        : [slideId];

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const element = document.elementFromPoint(
          moveEvent.clientX,
          moveEvent.clientY
        );
        if (!element) {
          return;
        }

        const holder = element.closest('[data-slide-id]') as HTMLElement | null;
        if (!holder) {
          dragTargetIdRef.current = null;
          return;
        }

        const targetId = holder.getAttribute('data-slide-id');
        if (!targetId || draggedSlideIdsRef.current.includes(targetId)) {
          // дроа на себя
          dragTargetIdRef.current = null;
          return;
        }

        const rect = holder.getBoundingClientRect();
        const mouseY = moveEvent.clientY;
        const isBottomHalf = mouseY > rect.top + rect.height / 2;

        dragTargetIdRef.current = targetId;
        insertAfterRef.current = isBottomHalf;
      };

      const handleMouseUp = () => {
        const draggedIds = draggedSlideIdsRef.current;
        const targetId = dragTargetIdRef.current;

        if (draggedIds.length === 0 || !targetId) {
          cleanup();
          return;
        }

        const allSlideIds = slides.map((slide) => slide.id);
        const remainingIds = allSlideIds.filter(
          (id) => !draggedIds.includes(id)
        );
        const targetIndexInRemaining = remainingIds.indexOf(targetId);

        if (targetIndexInRemaining === -1) {
          cleanup();
          return;
        }

        const newIndex = insertAfterRef.current
          ? targetIndexInRemaining + 1
          : targetIndexInRemaining;
        dispatch(moveSlides, {
          slideIds: draggedIds,
          newIndex,
        });
      };

      const cleanup = () => {
        draggedSlideIdsRef.current = [];
        dragTargetIdRef.current = null;
        insertAfterRef.current = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [selectedSlideIds]
  );

  return { handleMouseDown };
};
