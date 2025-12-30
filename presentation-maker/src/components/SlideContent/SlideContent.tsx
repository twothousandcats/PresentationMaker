import style from './SlideContent.module.css';
import { concatClassNames } from '../../store/utils/functions.ts';
import { usePlacementMode } from '../../store/hooks/usePlacementMode.ts';
import { useElementDND } from '../../store/hooks/useElementDND.ts';
import { useResize } from '../../store/hooks/useResize.ts';
import { SelectionOverlay } from '../SelectionOverlay/SelectionOverlay.tsx';
import type {
  EditorMode,
  Selection,
  Size,
  Slide,
} from '../../store/types/types.ts';
import SlideElement from '../SlideElement/SlideElement.tsx';
import { clearSelection } from '../../store/slices/editorSlice.ts';
import { useDispatch } from 'react-redux';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

type SlideContentProps = {
  slide: Slide;
  selection: Selection;
  size: Size;
  isEditable?: boolean;
  mode?: EditorMode;
  isPreview?: boolean;
};

export default function SlideContent({
  slide,
  selection,
  size,
  isEditable,
  mode,
  isPreview,
}: SlideContentProps) {
  const dispatch = useDispatch();
  const isActive = selection.selectedSlideIds.includes(slide.id);
  const activeElements =
    isActive && isEditable ? selection.selectedElementIds : [];
  // пропорции
  const [scaleInfo, setScaleInfo] = useState({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });

  const classNames = concatClassNames([
    style.slide,
    isEditable ? style.slide_editable : style.slide_preview,
    isActive && !isPreview && style.slide_active,
    isPreview && style.slide_reset,
  ]);

  const bgColor =
    slide.background?.type === 'solid' ? slide.background.color : '';
  const bgImg =
    slide.background && slide.background.type === 'image'
      ? slide.background.data
      : '';

  const { containerRef, placementPreview, handlePlacementStart, isPlacing } =
    usePlacementMode({
      mode,
      slide,
      isEditable: !!isEditable,
    });
  const isInteractive = isEditable && !isPlacing;
  const screenToLogical = useCallback(
    (screenX: number, screenY: number) => {
      if (!containerRef.current) {
        return { x: screenX, y: screenY }; // fallback
      }
      const rect = containerRef.current.getBoundingClientRect();
      const x = (screenX - rect.left - scaleInfo.offsetX) / scaleInfo.scale;
      const y = (screenY - rect.top - scaleInfo.offsetY) / scaleInfo.scale;
      return { x, y };
    },
    [scaleInfo, containerRef]
  );
  const { dragOffsets, handleDragStart } = useElementDND(
    slide,
    selection,
    isInteractive
  );
  const { startResizing, resizePreview } = useResize(slide, isInteractive, screenToLogical);

  const handleNonElementClick = (event: React.MouseEvent) => {
    if (event.target === containerRef.current) {
      if (isEditable) {
        dispatch(clearSelection());
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const updateScale = () => {
      const container = containerRef.current!;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const logicalWidth = size.width;
      const logicalHeight = size.height;

      if (logicalWidth === 0 || logicalHeight === 0) {
        return;
      }

      const scaleX = containerWidth / logicalWidth;
      const scaleY = containerHeight / logicalHeight;
      const scale = Math.min(scaleX, scaleY); // сохраняем пропорции

      const offsetX = (containerWidth - logicalWidth * scale) / 2;
      const offsetY = (containerHeight - logicalHeight * scale) / 2;

      setScaleInfo({ scale, offsetX, offsetY });
    };

    updateScale();

    if (isEditable) {
      const ro = new ResizeObserver(updateScale);
      ro.observe(containerRef.current);

      return () => {
        ro.disconnect();
      };
    }
  }, [size.width, size.height, isEditable, isPreview, containerRef]);

  return (
    <div
      ref={containerRef}
      className={classNames}
      style={{
        backgroundColor: `${bgColor}`,
        ...(bgImg && {
          backgroundImage: `url(${bgImg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }),
        ...(isEditable
          ? {
              cursor: isPlacing ? 'crosshair' : 'default',
            }
          : {
              aspectRatio: `${size.width} / ${size.height}`,
            }),
      }}
      onMouseDown={handlePlacementStart}
      onClick={handleNonElementClick}
    >
      {slide.elements.map((element) => {
        // логические -> экранные
        const screenX =
          scaleInfo.offsetX + element.position.x * scaleInfo.scale;
        const screenY =
          scaleInfo.offsetY + element.position.y * scaleInfo.scale;
        const screenW = element.size.width * scaleInfo.scale;
        const screenH = element.size.height * scaleInfo.scale;

        return (
          <SlideElement
            key={element.id}
            element={element}
            slideSize={size}
            slideId={slide.id}
            slideElements={slide.elements}
            selectedElementsIds={selection.selectedElementIds}
            isEditable={!!isEditable}
            isInteractive={isInteractive}
            isPlacing={isPlacing}
            isActive={isEditable && activeElements?.includes(element.id)}
            onDragStart={(clientX, clientY) =>
              handleDragStart(clientX, clientY)
            }
            dragOffset={dragOffsets[element.id] || { x: 0, y: 0 }}
            resizePreview={resizePreview?.[element.id]}
            styleOverride={{
              left: `${screenX}px`,
              top: `${screenY}px`,
              width: `${screenW}px`,
              height: `${screenH}px`,
            }}
            scale={scaleInfo.scale}
          />
        );
      })}
      {isEditable && (
        <SelectionOverlay
          selectedElementIds={selection.selectedElementIds}
          slideElements={slide.elements}
          slideSize={size}
          dragOffsets={dragOffsets}
          resizePreview={resizePreview}
          onStartResizing={startResizing}
          scale={scaleInfo.scale}
          offsetX={scaleInfo.offsetX}
          offsetY={scaleInfo.offsetY}
        />
      )}
      {placementPreview && (
        <div
          style={{
            position: 'absolute',
            top: placementPreview.y,
            left: placementPreview.x,
            width: placementPreview.width,
            height: placementPreview.height,
            border: '1px dashed #0078d4',
            backgroundColor: 'rgba(0, 120, 212, 0.1)',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
      )}
    </div>
  );
}
