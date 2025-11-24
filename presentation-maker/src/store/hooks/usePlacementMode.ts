import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  EditorMode,
  Slide,
  Position,
  SlideElement,
} from '../types/types.ts';
import { createTextEl, createRectangleEl } from '../utils/functions.ts';
import {
  addElementToSlide,
  setEditorMode,
  setSelectedElements,
} from '../slices/editorSlice.ts';
import * as React from 'react';
import { useDispatch } from 'react-redux';

const threshold = 5;

interface UsePlacementModeProps {
  slide: Slide;
  isEditable: boolean;
  mode?: EditorMode;
}

export function usePlacementMode({
  slide,
  isEditable,
  mode,
}: UsePlacementModeProps) {
  const dispatch = useDispatch();
  const safeMode: EditorMode = mode ?? { type: 'idle' };
  const containerRef = useRef<HTMLDivElement>(null);
  const placementPreviewRef = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [placementPreview, setPlacementPreview] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    placementPreviewRef.current = placementPreview;
  }, [placementPreview]);

  useEffect(() => {
    if (safeMode.type !== 'placing') {
      setPlacementPreview(null);
    }
  }, [safeMode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && safeMode.type === 'placing') {
        dispatch(setEditorMode({ mode: { type: 'idle' } }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, safeMode]);

  const handlePlacementStart = useCallback(
    (event: React.MouseEvent) => {
      if (!isEditable || safeMode.type !== 'placing' || !containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const startPosition: Position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      setPlacementPreview({
        x: startPosition.x,
        y: startPosition.y,
        width: 0,
        height: 0,
      });

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const currentPosition: Position = {
          x: moveEvent.clientX - rect.left,
          y: moveEvent.clientY - rect.top,
        };

        const x = Math.min(startPosition.x, currentPosition.x);
        const y = Math.min(startPosition.y, currentPosition.y);
        const width = Math.abs(currentPosition.x - startPosition.x);
        const height = Math.abs(currentPosition.y - startPosition.y);

        setPlacementPreview({ x, y, width, height });
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        const currentPreview = placementPreviewRef.current;

        if (
          currentPreview &&
          currentPreview.width >= threshold &&
          currentPreview.height >= threshold
        ) {
          let newElement: SlideElement;
          if (safeMode.elementType === 'rectangle') {
            newElement = createRectangleEl();
          } else {
            newElement = createTextEl();
          }

          newElement = {
            ...newElement,
            position: {
              x: currentPreview.x,
              y: currentPreview.y,
            },
            size: {
              width: currentPreview.width,
              height: currentPreview.height,
            },
          };

          dispatch(
            addElementToSlide({
              slideId: slide.id,
              newElement,
            })
          );
          dispatch(
            setSelectedElements({
              elementsIds: [newElement.id],
            })
          );

          dispatch(
            setEditorMode({
              mode: {
                type: 'idle',
              },
            })
          );
        }

        setPlacementPreview(null);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [isEditable, safeMode, dispatch, slide.id]
  );

  return {
    containerRef,
    placementPreview,
    handlePlacementStart,
    isPlacing: safeMode.type === 'placing',
  };
}
