import style from './SlideContent.module.css';
import { concatClassNames } from '../../store/utils/functions.ts';
import { usePlacementMode } from '../../store/hooks/usePlacementMode.ts';
import { useElementDND } from '../../store/hooks/useElementDND.ts';
import { useResize } from '../../store/hooks/useResize.ts';
import { SelectionOverlay } from '../SelectionOverlay/SelectionOverlay.tsx';
import type { EditorMode, Selection, Slide } from '../../store/types/types.ts';
import SlideElement from '../SlideElement/SlideElement.tsx';
import { clearSelection } from '../../store/slices/editorSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { selectCurrentPresentation } from '../../store/selectors/editorSelectors.ts';
import {
  PADDING_FACTOR,
  PREVIEW_LIST_SLIDE_HEIGHT,
  PREVIEW_LIST_SLIDE_WIDTH,
} from '../../store/utils/config.ts';

type SlideContentProps = {
  slide: Slide;
  selection: Selection;
  isEditable?: boolean;
  mode?: EditorMode;
  isPreview?: boolean;
  isCollection?: boolean;
};

export default function SlideContent({
  slide,
  selection,
  isEditable,
  mode,
  isPreview,
  isCollection,
}: SlideContentProps) {
  const { size } = useSelector(selectCurrentPresentation);
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
    isInteractive,
    screenToLogical
  );
  const { startResizing, resizePreview } = useResize(
    slide,
    isInteractive,
    screenToLogical
  );

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
      const container = containerRef.current;
      if (!container) {
        return;
      }
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const logicalWidth = size.width;
      const logicalHeight = size.height;

      const paddedContainerWidth = containerWidth * PADDING_FACTOR;
      const paddedContainerHeight = containerHeight * PADDING_FACTOR;

      const scaleX = paddedContainerWidth / logicalWidth;
      const scaleY = paddedContainerHeight / logicalHeight;
      const scale = Math.min(scaleX, scaleY); // сохраняем пропорции

      const scaledWidth = logicalWidth * scale;
      const scaledHeight = logicalHeight * scale;
      const offsetX = (containerWidth - scaledWidth) / 2;
      const offsetY = (containerHeight - scaledHeight) / 2;

      setScaleInfo({ scale, offsetX, offsetY });
    };

    updateScale();

    console.log(scaleInfo.scale);
    console.log(size.width);
    console.log(size.height);

    if (isEditable) {
      const ro = new ResizeObserver(updateScale);
      ro.observe(containerRef.current);

      return () => {
        ro.disconnect();
      };
    }
  }, [size.width, size.height, isEditable, isPreview, containerRef, scaleInfo.scale]);
  const previewScale =
    !isEditable && !isPreview && !isCollection
      ? Math.min(
          PREVIEW_LIST_SLIDE_WIDTH / size.width,
          PREVIEW_LIST_SLIDE_HEIGHT / size.height
        )
      : 1;

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
              transform: `scale(${scaleInfo.scale})`,
              width: `${size.width}px`,
              height: `${size.height}px`,
            }
          : {
              ...(isPreview
                ? {
                    transformOrigin: isCollection ? '0 0' : '',
                    transform: `scale(${isCollection ? 0.2 : 0.9})`,
                    width: `${size.width}px`,
                    height: `${size.height}px`,
                  }
                : {
                    width: `${PREVIEW_LIST_SLIDE_WIDTH}px`,
                    height: `${PREVIEW_LIST_SLIDE_HEIGHT}px`,
                  }),
            }),
      }}
      onMouseDown={handlePlacementStart}
      onClick={handleNonElementClick}
    >
      {slide.elements.map((element) => {
        // логические -> экранные
        const preview = resizePreview?.[element.id];

        const logicalX = preview?.position.x ?? element.position.x;
        const logicalY = preview?.position.y ?? element.position.y;
        const logicalW = preview?.size.width ?? element.size.width;
        const logicalH = preview?.size.height ?? element.size.height;
        const dx = dragOffsets[element.id]?.x ?? 0;
        const dy = dragOffsets[element.id]?.y ?? 0;

        let x = logicalX * previewScale + dx * previewScale;
        let y = logicalY * previewScale + dy * previewScale;
        let w = logicalW * previewScale;
        let h = logicalH * previewScale;

        if (isEditable) {
          x = logicalX + dx;
          y = logicalY + dy;
          w = logicalW;
          h = logicalH;
        }

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
            resizePreview={resizePreview?.[element.id]}
            styleOverride={{
              left: `${x}px`,
              top: `${y}px`,
              width: `${w}px`,
              height: `${h}px`,
            }}
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
