import style from './SlideContent.module.css';
import {
  concatClassNames,
} from '../../store/utils/functions.ts';
import {usePlacementMode} from "../../store/hooks/usePlacementMode.ts";
import {useElementDND} from "../../store/hooks/useElementDND.ts";
import {useResize} from "../../store/hooks/useResize.ts";
import { SelectionOverlay } from '../SelectionOverlay/SelectionOverlay.tsx';
import type {
  EditorMode,
  Selection,
  Size,
  Slide,
} from '../../store/types/types.ts';
import SlideElement from "../SlideElement/SlideElement.tsx";

type SlideContentProps = {
    slide: Slide;
    selection: Selection;
    size: Size;
    isEditable?: boolean;
    mode?: EditorMode;
};

export default function SlideContent(
    {
        slide,
        selection,
        size,
        isEditable,
        mode,
    }: SlideContentProps
) {
    const isActive = selection.selectedSlideIds.includes(slide.id);
    const activeElements =
        isActive && isEditable ? selection.selectedElementIds : [];

    const classNames = concatClassNames([
        style.slide,
        isEditable ? style.slide_editable : style.slide_preview,
        isActive && style.slide_active,
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
    const { dragOffsets, handleDragStart } = useElementDND(
        slide,
        selection,
        isInteractive
    );
    const { startResizing, resizePreview } = useResize(slide, isInteractive);

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
                        width: `${isEditable ? size.width : ''}px`,
                        height: `${isEditable ? size.height : ''}px`,
                        cursor: isPlacing ? 'crosshair' : 'default',
                    }
                    : {
                        width: '100%',
                        height: 'auto',
                        aspectRatio: `${size.width} / ${size.height}`,
                    }),
            }}
            onMouseDown={handlePlacementStart}
        >
            {slide.elements.map((element) => (
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
                    onDragStart={(clientX, clientY) => handleDragStart(clientX, clientY)}
                    dragOffset={dragOffsets[element.id] || { x: 0, y: 0 }}
                    resizePreview={resizePreview?.[element.id]}
                />
            ))}
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
};